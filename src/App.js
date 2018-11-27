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
      const urlPets = 'http://api.petfinder.com/pet.find?key=1edf8545fafb2f223f05f30911af67fa&location=45150&output=basic&format=json';
      // get array of local pets for adoption
      axios.get(urlPets) 
        .then(res => {
          this.setState({
            pets: res.data.petfinder.pets.pet
          })
        })

        .catch(error => {
            alert('Sorry, No pet data was received from the server. Please try again.')
        })

          console.log('pets:')
          console.log(this.state.pets)
        };

  // Create the function which can be passed or called as needed to get local shelters
  getLocalShelters = () => {
      const urlLocations = 'http://api.petfinder.com/shelter.find?key=1edf8545fafb2f223f05f30911af67fa&location=45150&output=basic&format=json';
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
            alert('Sorry, No local shelter data was received from the server. Please try again.')
            this.renderMap()
        })
    }

  getShelterPets = (selectedShelter) => {
    // get array of pets in the selected shelter
    let urlShelter = 'http://api.petfinder.com/shelter.getPets?key=1edf8545fafb2f223f05f30911af67fa&output=basic&format=json&id='+selectedShelter;
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
            alert('Sorry, No pet data for the selected shelter was received from the server. Please try again.')
        })
    }

    // When a shelter is selected from the menu, filter the markers and the pets
  onShelterSelect = (event) =>{
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
      this.markerMaker(selectedShelter)     // show only the marker for the selected shelter
    }
    // marker filter based on selection
  markerMaker = (selectedShelter) => {   
    this.state.shelterMarkers.map((marker) => {
      // only show the markers for selected locations
      {(selectedShelter !== 'all')&&(selectedShelter !== marker.key)
      ? marker.setVisible(false)
      : marker.setVisible(true)}    
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
    <h1>Furry Friend Finder</h1>
  </div>

  <div id = "container">
          <div id= 'menu' className = "section1">
              <legend><h2><em>View adoptable pets</em></h2></legend>
              <form>
                      <select 
                        id="shelterMenu" 
                        value={this.state.selectedShelter} 
                        onChange={this.onShelterSelect}>
                        <option disabled value='' >Select a shelter to view their pets:</option>
                        <option value='all' >View all area pet shelters</option>
                      {shelters.map((shelter, index, key) =>
                        <option 
                          key={index}
                          id={key}
                          value={shelter.id.$t}>
                          {shelter.name.$t} ({shelter.id.$t})
                        </option>
                      )}
                      </select>
                </form>
            </div>

        <div id = "map" role='application'> 
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
