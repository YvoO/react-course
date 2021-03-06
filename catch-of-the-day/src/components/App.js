import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import Base from '../Base';

export default class App extends React.Component {
	constructor(){
		super();
		this.addFish = this.addFish.bind(this);
		this.updateFish = this.updateFish.bind(this);
		this.removeFish = this.removeFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.removeFromOrder = this.removeFromOrder.bind(this);
		//getinitialState
		this.state = {
			fishes: {},
			order: {},
		};
		console.log(this.state.fishes);
		console.log(this.state.order);
	}

	componentWillMount() {
		// this runs right before the <App> is rendered
		this.ref = Base.syncState(`${this.props.params.storeID}/fishes`, 
		{
			context: this,
			state: 'fishes'
		});

		// check if there is any order in local storage
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeID}`);

		if(localStorageRef){
			this.setState({
				order: JSON.parse(localStorageRef)
			})
		}
	}

	componentWillUnmount() {
		Base.removeBinding(this.ref); 
	}

	componentWillUpdate(nextProps, nextState){
		localStorage.setItem(`order-${this.props.params.storeID}`, JSON.stringify(nextState.order));
	}

	addFish(fish){
		//update our state
		const fishes = {...this.state.fishes};
		// add in our new fish
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		//set state/
		this.setState({
			fishes: fishes 
		})
	}

	updateFish(key, updatedFish){
		const fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		this.setState({
			fishes: fishes
		})
	}

	removeFish(key){
		const fishes = {...this.state.fishes}
		fishes[key] = null;
		this.setState({
			fishes: fishes
		})
	}

	loadSamples() {
		this.setState({
			fishes: sampleFishes
		})
	}

	addToOrder(key){
		// take a copy of our stat
		const order = {...this.state.order};
		// update or add the new number of fish ordered
		order[key] = order[key] + 1 || 1;
		// update our state
		this.setState({
			order: order
		})
	}

	removeFromOrder(key){
		const order = {...this.state.order};
		delete order[key];
		this.setState({
			order: order
		})
	}

	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market"/>
					<ul>
						{
							Object
							.keys(this.state.fishes)
							.map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)
						}
					</ul>
				</div>
				<Order 
					fishes={this.state.fishes} 
					order={this.state.order}
					params={this.props.params}
					removeFromOrder={this.removeFromOrder}
				/>
				<Inventory 
					fishes={this.state.fishes}
					addFish={this.addFish} 
					updatedFish={this.updateFish} 
					removeFish={this.removeFish}
					loadSamples={this.loadSamples}
				/>
			</div>
		)
	}
}

