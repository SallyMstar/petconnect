import React, { Component } from 'react';
import sortBy from 'sort-by'
import axios from 'axios'
import './App.css';


class App extends Component {

  constructor(props) {
    super(props);
      this.state = {
        pets: [],
        shelters: [],
        shelterPets: [],
        selectedShelter: '',
      };
    }

  componentDidMount() {
    this.getLocalPets()
    this.getLocalShelters()
  }

// Create the function which can be passed or called as needed to get local pets
  getLocalPets = () => {
    const urlPets = 'http://api.petfinder.com/pet.find?key=1edf8545fafb2f223f05f30911af67fa&location=45150&output=basic&format=json';
    // get array of local pets for adoption
    axios.get(urlPets) 
      .then(res => {
        this.setState({
          pets: res.data.petfinder.pets.pet
        })
        console.log('pets:')
        console.log(this.state.pets)
      })
  }

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
  }
// Draw the map
  renderMap = () => {
    let mapKey = "AIzaSyAyEUmiQYNT6nrZK6ACULxyVASU8XcyWNc"
    scriptInit("https://maps.googleapis.com/maps/api/js?key="+mapKey+"&callback=initMap")
    window.initMap = this.initMap
}


// Set the map parameters for the renderMap() to use
  initMap = () => {
    let lat = 39.155393
    let lng = -84.274159
    const map = new window.google.maps.Map(document.getElementById('map'), {
            center: {
              lat: lat, 
              lng: lng
              },
            zoom: 11
        });

    // Loop over my shelter locations to put markers on the map
    let shelters = this.state.shelters
    this.state.shelters.map((shelter) => {
        console.log(shelter.latitude.$t, shelter.longitude.$t)
        let marker = new window.google.maps.Marker({
          position: {
            lat: shelter.latitude.$t,
            lng: shelter.longitude.$t
          },
          map: map,
          title: 'Hello World!'
        })
    })
} // end initMap()

  render() {
    return (
      <main>
        <div id="map">

        </div>
      </main>
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
