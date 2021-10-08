import React from "react";
import {Helmet} from "react-helmet";

const GetPets = () => {
    return (
        <div className="application">
      <Helmet>
        <script src="http://code.jquery.com/jquery-latest.js" type='text/javascript'>
         	  $.getJSON("http://api.petfinder.com/pet.find?key=qYDR44KE32EF0hKonCqN0pBFGiyQghnVVlCwvyMfhhNLd6sb5H&location=45150&output=basic&format=json&callback=?")
        </script>
      </Helmet>
        </div>
    );
}

export default GetPets
