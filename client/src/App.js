import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  // when component mounts: first thing it does is fetch all existing data in our db
  // then we incorporatea polling logic so that we can see if our db has changed
  // and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDatafromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // kill process when we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
        this.setState({ intervalIsSet: null });
    }
  }

  // in the front end, we use the id key of our data object in order to identify
  // which we want, to Update or to Delete
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries 

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("/api/getData")
    .then(data => data.json())
    .then (res => this.setState ({ data: res.data}));
  }

  // our put method taht uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    };
    // api POST
    axios.post("/api/putData", {
      id: idToBeAdded,
      message: message
    });
  };

  // delete method that uses backend api to remove
  // existing db information
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      };
    })

    // api DELETE
    axios.delete("/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };

  // our update method that uses our backend api
  // to overwrite existing database information

  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

  // api UPDATE
    axios.post("/api/UpdateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <ul>
          {data.length <= 0 
          ? "NO DB ENTRIES YET"
          : data.map(dat => (
            <li style={{ padding: "10px" }} key={data.message}>
              <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
              <span style={{ color: "gray" }}> data: </span> {dat.message} <br />
            </li>
          ))}
          </ul>
          <div style={{ padding: "10px" }}>
            <input 
            type="text"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="add something in the database"
            style={{ width: "200px" }}
            />
            <button onClick={() => this.putDataToDB(this.state.message)}>
              ADD 
              </button>
          </div>

          <div style={{ padding: "10px" }}>
            <input 
            type="text"
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
            style={{ width: "200px" }}
            />
            <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
              DELETE 
              </button>
          </div>

          <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToUpdate: e.target.value })}
            placeholder="id of item to update here"
          />
            <input 
            type="text"
            onChange={e => this.setState({ updateToApply: e.target.value })}
            placeholder="new value of item here"
            style={{ width: "200px" }}
            />
            <button onClick={() => this.updateDB(this.state.idToUpdate, this.state.updateToApply)}>
              UPDATE 
              </button>
          </div>
          </div>

    );
  }
}

export default App;
