var React = require('react');
var ReactDOM = require('react-dom');
//require react for the browser

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;

var History = ReactRouter.History;


var createBrowserHistory = require('history/lib/createBrowserHistory');
//for using push state

//react router

var h = require('./helpers');
/*include helpers js*/

/* App component */
var App = React.createClass({
  //sets the initial state objects which will be populated
  getInitialState: function(){
    return {
      fishes: {},
      order: {}
    };
  },
  addToOrder : function(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order: this.state.order });
  },
  //adding the fish to the app state
  addFish : function(fish){
    // unique timestamp
    var timestamp = (new Date()).getTime();
    //update the state
    this.state.fishes['fish-' + timestamp] = fish;
    //set the state ( only for specific object --> performance reasons)
    this.setState({ fishes: this.state.fishes } );
  },
  loadSamples : function() {
    this.setState({
      fishes: require("./sample-fishes")
    });
  },
  renderFish : function(key) {
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>;
  },
  render: function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          {/* iteration over an array with map*/}
          </ul>
        </div>
        <Order/>
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
        {/*pass the addfish method to inventory component*/}
      </div>
    );
  }  
});


/*Fish*/

var Fish = React.createClass({
  onButtonClick : function() {
    console.log("going to add the fish", this.props.index);
    var key = this.props.index;
    this.props.addToOrder(key);
  },
  render : function() {
    var details = this.props.details;
    var isAvailable = (details.status === 'available' ? true : false);
    var buttonText = (isAvailable ? 'Add to order' : 'Sold out!');
    return (
      <li className="menu-fish">
        <img src={details.image} alt={details.name} />
        <h3 className="fish-name">
          {details.name}
          <span className="price">{h.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
    )
  }
});


/* Add fish form */
var AddFishForm = React.createClass({
  createFish: function(event){
    //stop the data from submitting
    event.preventDefault();
    // take the data from the form and create a fish object
    var fish = {
      name : this.refs.name.value,
      price : this.refs.price.value,
      status : this.refs.status.value,
      desc : this.refs.desc.value,
      image : this.refs.image.value
    };
    //  add the fish to the app state
    this.props.addFish(fish);

    //clears the form after submitting
    this.refs.fishForm.reset();

  },
  render : function() {
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price"/>
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">sold out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="url to image"/>
        <button type="submit">+ Add item</button>
      </form>
    );
  }
});

/* header */
var Header = React.createClass({
  render : function() {
    console.log(this.props.tagline);
    return (
      <header className="top">
        <h1>Catch 
          <span className="ofThe">
            <span className="of">of </span>
            <span className="the">the</span> 
          </span>
          day
        </h1>
        <h3 className="tagline">
          <span>{this.props.tagline}</span>
        </h3>
      </header>
    );
  }
});

/* Order */
var Order = React.createClass({
  render : function() {
    return (
      <p>Order</p>
    );
  }
});

/* Inventory */
var Inventory = React.createClass({
  render : function() {
    return (
      <div>
        <h2>Inventory</h2>
        <AddFishForm {...this.props} />
        {/*the ... (spread) adds all the props from inventory to fishform, passes them down*/}
        <button onClick={this.props.loadSamples}>Load the sample fishes</button>       
      </div>
    );
  }
});

/*
  Storepicker
  This will let us make <StorePicker/>
*/

var StorePicker = React.createClass({
  mixins: [History],
  //use of the reactrouter history mixin for pushstate
  goToStore: function(event) {
    event.preventDefault();
    var storeId = this.refs.storeId.value;
    /* ref is the reference to the ref in the input */
    //get the data from the input

    console.log(storeId);
    this.history.pushState(null, '/store/' + storeId);

    //transition from storepicker to app
  },
  render : function(){
    var name = 'Thomas';
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        {/* this refers to the StorePicker component */}
        <h2>Please enter a store {name}</h2>
        <input type="text" ref="storeId" defaultValue={h.getFunName()} required/>
        {/* using a helper function declared in helpers js*/}
        <input type="submit"/>
      </form>
    );
  }
});


/* not found component */
var NotFound = React.createClass({
  updateCount : function(){
    console.log(this.refs.counter.value)


  },
  render : function() {
    return (
      <h1>Whoops! nothing here</h1>
    );
  }
});


/* Routes */
var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
);


ReactDOM.render(routes, document.querySelector('#main'));

