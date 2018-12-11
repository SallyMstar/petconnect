import React from "react";
import {Helmet} from "react-helmet";

const GetPets = () => {
    return (
        <div className="application">
      <Helmet>
        <script src="http://code.jquery.com/jquery-latest.js" type='text/javascript'>
         	  $.getJSON("http://api.petfinder.com/pet.find?key=1edf8545fafb2f223f05f30911af67fa&location=45150&output=basic&format=json&callback=?")
        </script>
      </Helmet>
        </div>
    );
}

export default GetPets