import React, { Component } from "react";
import ContactDataService from "../services/contact.service";

export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeCompany = this.onChangeCompany.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    //this.saveContact = this.saveContact.bind(this);
    this.getContact = this.getContact.bind(this);
    this.updateContact = this.updateContact.bind(this);
    this.deleteContact = this.deleteContact.bind(this);

    this.state = {
      currentContact: {
        id: null,
        firstName: "",
        lastName: "",
        company: "",
        title: ""
      },
      message: ""
    };
  }

  componentDidMount() {
    this.getContact(this.props.match.params.id);
  }

  onChangeFirstName(e) {
    const firstName = e.target.value;

    this.setState(function (prevState) {
      return {
        currentContact: {
          ...prevState.currentContact,
          firstName: firstName
        }
      };
    });
  }

  onChangeLastName(e) {
    const lastName = e.target.value;

    this.setState(function (prevState) {
      return {
        currentContact: {
          ...prevState.currentContact,
          lastName: lastName
        }
      };
    });
  }

  onChangeCompany(e) {
    const company = e.target.value;

    this.setState(function (prevState) {
      return {
        currentContact: {
          ...prevState.currentContact,
          company: company
        }
      };
    });
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function (prevState) {
      return {
        currentContact: {
          ...prevState.currentContact,
          title: title
        }
      };
    });
  }

  getContact(id) {
    ContactDataService.get(id)
      .then(response => {
        this.setState({
          currentContact: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateContact() {
    ContactDataService.update(
      this.state.currentContact.id,
      this.state.currentContact
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          message: "The Contact was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteContact() {
    ContactDataService.delete(this.state.currentContact.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/contacts')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { currentContact } = this.state;

    return (
      <div>
        {currentContact ? (
          <div className="edit-form">
            <h4>Contact</h4>
            <form>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={currentContact.firstName}
                  onChange={this.onChangeFirstName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={currentContact.lastName}
                  onChange={this.onChangeLastName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  className="form-control"
                  id="company"
                  value={currentContact.company}
                  onChange={this.onChangeCompany}
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentContact.title}
                  onChange={this.onChangeTitle}
                />
              </div>

            </form>

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteContact}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateContact}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
            <div>
              <br />
              <p>Please click on a Contact...</p>
            </div>
          )}
      </div>
    );
  }
}