import React, { Component } from 'react';

class PetParade extends Component {

	state= {
		pets: [],
		filteredPets: [],
		shelterPets: []
	}

render() {
	let filteredPets = (((this.props.shelterPets)&&(this.props.shelterPets.length > 0)) ? (this.props.shelterPets) : (this.props.pets ))

	return(

		<div className="section2">
		{(((!this.props.shelterPets) || (this.props.shelterPets.length === 0) || (this.props.selectedShelter === 'OH209')) ? 
			(<div className='noResults'>No shelter selected or no matching results.<br/>Viewing 25 nearby pets</div>):(
				<div className='noResults'>{this.props.shelterPets.length || 'No results. \nViewing nearby' } pets (max 25)</div>
				))}
			{filteredPets.map((pet) =>
					<div id = 'petProfile'
						key={pet.id.$t} 
						className = "item">
	                	<div 
	                	className ='petName'
	                	tabIndex='0'
	                	aria-label= {pet.name.$t}
	                	>
	                		~ {pet.name.$t} ~
	                			<br/>
	                		{pet.breeds.breed.$t}
	                	</div>
	              {((pet.media.photos) && (pet.media.photos.photo[2].$t)) 
	              		? (<img 
	                		src={pet.media.photos.photo[2].$t} 
	                		alt={pet.name.$t} 
	                		tabIndex='0'
	                		/>
	                	) : (
	                		<p tabIndex='0'>no image available</p>
	                	)
	                	}
	                <div tabIndex='0' aria-label={pet.shelterId.$t}>
	                Shelter {pet.shelterId.$t}
	                </div>
					</div>

				)}
			}
		</div>

		)
}
}

export default PetParade