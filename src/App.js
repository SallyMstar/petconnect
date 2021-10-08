import React, { Component } from 'react'
import sortBy from 'sort-by'
import axios from 'axios'
import PetParade from './PetParade'
import './App.css'

  // global variables to allow access from any function
let map;

class App extends Component {

  constructor(props) {
    super(props);
      this.state = {
        pets: [],
        shelters: [],
        shelterSelected: false,
        selectedShelter: 'all',
        shelterData: [],
        shelterPets: [],
        shelterMarkers: []
      };

  this.onShelterSelect = this.onShelterSelect.bind(this);

    }


  componentDidMount() {
    this.getLocalPets()
    this.getLocalShelters()
  }

// ========================== Function Factory ====================================
  // Create the function which can be passed or called as needed to get local pets
  getLocalPets = () => {
      const urlPets = 'http://api.petfinder.com/pet.find?key=qYDR44KE32EF0hKonCqN0pBFGiyQghnVVlCwvyMfhhNLd6sb5H&location=45150&output=basic&format=json';
      // get array of local pets for adoption
      axios.get(urlPets) 
        .then(res => {
          this.setState({
            pets: res.data.petfinder.pets.pet
          })
        })

        .catch(error => {
            alert('Sorry, No pet data was received from the server. Please enable the CORS plugin on your browser.')
        })

          console.log('pets:')
          console.log(this.state.pets)
        };

  // Create the function which can be passed or called as needed to get local shelters
  getLocalShelters = () => {
      const urlLocations = 'http://api.petfinder.com/shelter.find?key=qYDR44KE32EF0hKonCqN0pBFGiyQghnVVlCwvyMfhhNLd6sb5H&location=45150&output=basic&format=json';
       // get array of local animal shelters
      axios.get(urlLocations)
        .then(res => {
          let orderedResults = res.data.petfinder.shelters.shelter.sort(sortBy('name.$t'))
          this.setState({
            shelters: orderedResults
          }, this.renderMap())

          console.log('ordered list of shelters')
          console.log(this.state.shelters)
        })
        .catch(error => {
            alert('Sorry, No local shelter data was received from the server. Please enable the CORS plugin on your browser.')
            this.renderMap()
        })
    }

  getShelterPets = (selectedShelter) => {
    // get array of pets in the selected shelter
    let urlShelter = 'http://api.petfinder.com/shelter.getPets?key=qYDR44KE32EF0hKonCqN0pBFGiyQghnVVlCwvyMfhhNLd6sb5H&output=basic&format=json&id='+selectedShelter;
    this.setState({selectedShelter: selectedShelter})
    axios.get(urlShelter)
      .then(res => {  
          let shelterPets = res.data.petfinder.pets.pet
        this.setState({
          shelterPets: shelterPets,
              shelterSelected: true
        })
      console.log(shelterPets)
      })
      .catch(error => {
            alert('Sorry, No pet data for the selected shelter was received from the server. Please enable the CORS plugin on your browser.')
        })
    }

    // When a shelter is selected from the menu, filter the markers and the pets
  onShelterSelect = (event) =>{
    console.log(event.target.value)
    let selectedShelter = event.target.value
    console.log(selectedShelter)
    if(selectedShelter === 'all') {
      this.setState({
        selectedShelter: 'all',
        shelterPets: [],
        shelterData: [],
        shelterSelected: false
      })
      this.markerMaker(selectedShelter)  // show all markers for 'all' selection
      return
      }
      // get the shelter that matches the selection
      let shelterData = this.state.shelters.filter((shelter) => {
        return (shelter.key === event.target.value)
      })
        this.setState({
          shelterData: shelterData  // set the selected shelter
        })
        // let shelterLat = parseFloat(shelterData[0].latitude.$t) 
        // let shelterLng = parseFloat(shelterData[0].longitude.$t) 
      this.getShelterPets(selectedShelter)  // get the pets for selected shelter
      this.markerMaker(selectedShelter, true)     // show only the marker for the selected shelter
    }
    // marker filter based on selection
  markerMaker = (selectedShelter, active) => {   
    this.state.shelterMarkers.map((marker) => {
      // only show the markers for selected locations
      {(selectedShelter !== 'all')&&(selectedShelter !== marker.key)
      ? marker.setVisible(false)
      : marker.setVisible(true)}  

      if((selectedShelter === marker.key) && (active === true)) {
         (window.google.maps.event.trigger(marker, 'click'))
    }       
    })
  }



  // Draw the map =======================================================
  renderMap = () => {  
    let mapKey = "AIzaSyAyEUmiQYNT6nrZK6ACULxyVASU8XcyWNc"
    scriptInit("https://maps.googleapis.com/maps/api/js?key="+mapKey+"&callback=initMap")
    window.initMap = this.initMap  // specify where to find initMap for the callback function
    }


// Set the center for the renderMap() to use
  initMap = (setLat, setLng) => {
    let lat = (setLat || 39.185393)  // set selected location or initial center
    let lng = (setLng || -84.274159) // set selected loaction or initial center
    const map = new window.google.maps.Map(document.getElementById('map'), {
            center: {
              lat: lat, 
              lng: lng
              },
            zoom: (this.props.shelterSelected === true) ? 15 : 10
        });

// Create the infoWindow to call on when a marker is clicked
    const infoWindow = new window.google.maps.InfoWindow()

// Markers ============================================================
    let shelterMarkers = []
    // Loop over my shelter locations to put markers on the map
    let shelters = this.state.shelters
    shelters.map((shelter) => {

      // set shelter data for use
        let name = shelter.name.$t;
        let id = shelter.id.$t;
        let address = shelter.address1.$t;
        let cityName = shelter.city.$t;
        let stateName = shelter.state.$t;
        let zipcode = shelter.zip.$t;
        shelter.title = name;
        shelter.key = id;
        shelter.address = address;
        shelter.cityName = cityName;
        shelter.stateName = stateName;
        shelter.zipcode = zipcode;


      // InfoWindow Content ===========================================
        let shelterInfo = 
                '<div>'+
                  '<h3>'+`${shelter.title}`+'</h3>'+
                    `${shelter.address || ''}`+
                    '<br />'+
                    `${shelter.cityName}`+', '+
                    `${shelter.stateName}`+' '+
                    `${shelter.zipcode}`+
                '</div>';
                // end infoWindow content

      // Create the markers & drop them onto the map
      // Only show the selected locations

        let marker = new window.google.maps.Marker({
          position: {
            lat: parseFloat(shelter.latitude.$t), // parseFloat to convert from string to number
            lng: parseFloat(shelter.longitude.$t)
          },
          map: map,
          title: shelter.name.$t,
          key: shelter.key,
          animation: window.google.maps.Animation.DROP,
        }) // end marker

      // Show infowindow & toggle bounce on marker click
        marker.addListener('click', function() {
          infoWindow.setContent(shelterInfo)
          infoWindow.open(map, marker)
          setTimeout(function() {
            infoWindow.close()},5000)
          console.log(marker.key)
          map.setZoom(13)
          setTimeout(function() {
            map.setZoom(10)
            map.setCenter({
              lat: 39.185393,
              lng: -84.27415
            })
          }, 5000)
          map.setCenter(marker.getPosition())
          if(marker.getAnimation(true)) {
              marker.setAnimation(null)
          } else {
            marker.setAnimation(window.google.maps.Animation.BOUNCE)
              setTimeout(function() {
                marker.setAnimation(null)}, 3000)
          }
        }); // end 1st listener function
          console.log(marker.getVisible())
          shelterMarkers.push(marker)


    }) // end shelters.map
      this.setState({
        shelterMarkers: shelterMarkers
      })

} // end map ===========================================================


  render() {

      let pets = this.state.pets;
      let shelters = this.state.shelters

    return (
<>
  <div id = "header">
  <a href='https://github.com/SallyMstar/petconnect#follow-the-instructions-below-to-enable-the-plugin-for-your-browser' target = 'blank'>How to enable CORS plugin</a>
    <h1>Furry Friend Finder</h1>
  </div>

  <div id = "container">
          <div id= 'menu' className = "section1">
              <legend><h3><em>Select a shelter:</em></h3></legend>
                      <button 
                          tabIndex='0'
                          value='all'
                          onClick = {(event) => this.onShelterSelect(event)}
                          aria-label = 'View all area Shelters'
                          >
                          -- View all area shelters --
                      </button>
                      {shelters.map((shelter, index, key) =>
                      <button 
                          tabIndex='0'
                          aria-label = {shelter.name.$t}
                          key={index}
                          value={shelter.id.$t}
                          onClick = {(event) => this.onShelterSelect(event)}
                          onMouseOver={() => this.markerMaker(shelter.id.$t)}
                          onMouseOut={() => this.markerMaker(this.state.selectedShelter)}
                          >
                          {shelter.name.$t} ({shelter.id.$t})
                          </button>
                      )}
            </div>

        <div id = "map" tabIndex='0' role='application'> 
        </div>

      <PetParade 
        pets={this.state.pets} 
        shelterPets={this.state.shelterPets} 
        shelterSelected={this.state.shelterSelected}
        selectedShelter={this.state.selectedShelter} 
        markerMaker = {this.markerMaker}
        />

</div>


  <div className='section3'>
      *Please note that more than one shelter may be based in the same location.<br/>
      Pet data provided by PetFinder API, & the <a href="https://pngtree.com/free-icon/paws_626868">Paw Print Icon</a> is from pngtree.com
  </div>

</>
    );
  }
}

function scriptInit(url) {
  let index = window.document.getElementsByTagName('script')[0]
  let script = window.document.createElement('script')
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script,index)
}

export default App;
