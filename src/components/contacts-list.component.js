import React, { Component } from "react";
import axios from 'axios';
import Pagination from "react-js-pagination";
//import Pagination from "@material-ui/lab/Pagination";
//import TutorialDataService from "../services/tutorial.service";
import { Link } from "react-router-dom";
// import { PaginationPage, PaginationPropertySort } from '../interface/pagination';

export default class ContactsList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    // this.retrieveTutorials = this.retrieveTutorials.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveContact = this.setActiveContact.bind(this);
    // this.removeAllTutorials = this.removeAllTutorials.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);

    this.searchTitle = this.searchTitle.bind(this);

    this.state = {
      contacts: [],
      currentContact: null,
      currentIndex: -1,
      searchTitle: "",

      page: 1,
      count: 0,
      itemsCountPerPage: 3,
      sort: "",

      //articlesDetails: [],
      activePage: 0,
      totalPages: null,
      //itemsCountPerPage: null,
      totalItemsCount: null
    };

    this.pageSizes = [3, 6, 9];

    this.findContactsWithSortAndFilter = this.findContactsWithSortAndFilter.bind(this);
  }

  componentDidMount() {
    //this.retrieveTutorials();
    this.findContactsWithSortAndFilter(this.state.searchTitle, this.state.sort, this.state.activePage, this.state.itemsCountPerPage);
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }

  getRequestParams(searchTitle, page, itemsCountPerPage) {
    let params = {};

    if (searchTitle) {
      params["search"] = searchTitle;
    }

    if (page) {
      params["page"] = page - 1;
    }

    if (itemsCountPerPage) {
      params["itemsCountPerPage"] = itemsCountPerPage;
    }

    return params;
  }

  //findContactsWithSortAndFilter(search, page, itemsCountPerPage) {

  findContactsWithSortAndFilter(

    filter = '', sort = '',
    pageNumber = 0, pageSize = 3) {

    //const apiUrl = `http://localhost:8085/dashboard-server/api/contact?page=${pageNumber}&size=${pageSize}`;
    let apiUrl = 'http://localhost:8081/resource-server/api/contact';

    const params = { page: pageNumber, size: pageSize };
    if (sort != null) {
      params.sort = sort.property + ',' + sort.direction;
    }

    let sortTest = 'asc';
    //if (sort.property !== '') {
    //  sortTest = sort.property + ',' + sort.direction;
    //}
    let search = '';
    if (filter !== '') {
      apiUrl = 'http://localhost:8081/resource-server/api/contact/search';
      // search = 'firstName==' + filter + '* or ' + 'lastName==' + filter + '*';
      // search = 'lastName==' + filter + '*';
      search = 'firstName==' + filter + '* or ' + 'lastName==' + filter + '* or ' + 'company==' + filter + '*';
    }

    axios.get(apiUrl, {
      params: {
        'search': search,
        'sort': sortTest,
        'page': pageNumber.toString(),
        'size': pageSize.toString()
      }
    })

      .then(response => {

        const totalPages = response.data.totalPages;
        const itemsCountPerPage = response.data.size;
        const totalItemsCount = response.data.totalElements;

        this.setState({ totalPages: totalPages })
        this.setState({ totalItemsCount: totalItemsCount })
        this.setState({ itemsCountPerPage: itemsCountPerPage })

        const results = response.data.content;

        const updatedResults = results.map(results => {

          var timestamp = new Date(results.pubDate)
          var dateString = timestamp.toGMTString()
          return {
            ...results, dateString
          }
        });

        this.setState({ contacts: updatedResults });
        console.log(updatedResults);
        console.log(this.state.activePage);
        console.log(this.state.itemsCountPerPage);

      }
      );
  }

  /*
  
  retrieveTutorials() {
    const { searchTitle, page, itemsCountPerPage } = this.state;
    const params = this.getRequestParams(searchTitle, page, itemsCountPerPage);
  
    TutorialDataService.getAll(params)
      .then((response) => {
        const tutorials = response.data.content;
        const totalPages = response.data.totalPages;
  
        this.setState({
          tutorials: tutorials,
          count: totalPages,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  
  
    handlePageChange(event, value) {
      this.setState(
        {
          page: value,
        },
        () => {
          //this.retrieveTutorials();
          this.findContactsWithSortAndFilter(this.state.activePage);
        }
      );
    }
  */

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);

    this.setState({ activePage: pageNumber -1 });

    // this.state.activePage = pageNumber;

    //this.findContactsWithSortAndFilter(pageNumber)
    this.findContactsWithSortAndFilter(this.state.searchTitle, this.state.sort, pageNumber-1, this.state.itemsCountPerPage);

  }

  handlePageSizeChange(event) {
    this.setState(
      {
        itemsCountPerPage: event.target.value,
        page: 1
      },
      () => {
        //this.retrieveTutorials();
        this.findContactsWithSortAndFilter(this.state.searchTitle, this.state.sort, this.state.activePage -1, this.state.itemsCountPerPage);

      }
    );
  }

  refreshList() {
    //this.retrieveTutorials();
    this.findContactsWithSortAndFilter(this.state.activePage);

    this.setState({
      currentContact: null,
      currentIndex: -1
    });
  }

  setActiveContact(contact, index) {
    this.setState({
      currentContact: contact,
      currentIndex: index
    });
  }

/*
  removeAllTutorials() {
    TutorialDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }
*/

  searchTitle() {
    this.findContactsWithSortAndFilter(this.state.searchTitle, this.state.sort, this.state.activePage -1, this.state.itemsCountPerPage);
  }

  render() {
    /*
      const { searchTitle, 
        tutorials, 
        currentContact, 
        currentIndex } = this.state;
    */
    const {
      searchTitle,
      contacts,
      currentContact,
      currentIndex,
      page,
      count,
      itemsCountPerPage,
    } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Contacts List</h4>



          <ul className="list-group">
            {contacts &&
              contacts.map((contact, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveContact(contact, index)}
                  key={index}
                >
                  {contact.firstName} {contact.lastName}
                </li>
              ))}
          </ul>

          <div className="mt-3">
            {"Items per Page: "}
            <select onChange={this.handlePageSizeChange} value={itemsCountPerPage}>
              {this.pageSizes.map((itemsCountPerPage) => (
                <option key={itemsCountPerPage} value={itemsCountPerPage}>
                  {itemsCountPerPage}
                </option>
              ))}
            </select>

            <Pagination
              className="my-3"
              hideNavigation
              activePage={this.state.activePage}
              itemsCountPerPage={this.state.itemsCountPerPage}
              totalItemsCount={this.state.totalItemsCount}
              pageRangeDisplayed={10}
              itemClass='page-item'
              linkClass='btn btn-light'
              onChange={this.handlePageChange}
            />
          </div>

        </div>
        <div className="col-md-6">
          {currentContact ? (
            <div>
              <h4>Contact</h4>
              <div>
                <label>
                  <strong>First Name:</strong>
                </label>{" "}
                {currentContact.firstName}
              </div>
              <div>
                <label>
                  <strong>Last Name:</strong>
                </label>{" "}
                {currentContact.lastName}
              </div>
              <div>
                <label>
                  <strong>Company:</strong>
                </label>{" "}
                {currentContact.company}
              </div>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentContact.title}
              </div>

              <Link
                to={"/contacts/" + currentContact.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
              <div>
                <br />
                <p>Please click on a Contact...</p>
              </div>
            )}
        </div>
      </div>
    );
  }
  /*
    render() {
      const {
        searchTitle,
        tutorials,
        currentContact,
        currentIndex,
        page,
        count,
        pageSize,
      } = this.state;
  
      return (
        <div className="list row">
          <div className="col-md-8">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title"
                value={searchTitle}
                onChange={this.onChangeSearchTitle}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.retrieveTutorials}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <h4>Tutorials List</h4>
  
            <div className="mt-3">
              {"Items per Page: "}
              <select onChange={this.handlePageSizeChange} value={pageSize}>
                {this.pageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
  
              <Pagination
                className="my-3"
                count={count}
                page={page}
                siblingCount={1}
                boundaryCount={1}
                variant="outlined"
                shape="rounded"
                onChange={this.handlePageChange}
              />
            </div>
  
            <ul className="list-group">
              {tutorials &&
                tutorials.map((tutorial, index) => (
                  <li
                    className={
                      "list-group-item " +
                      (index === currentIndex ? "active" : "")
                    }
                    onClick={() => this.setActiveTutorial(tutorial, index)}
                    key={index}
                  >
                    {tutorial.title}
                  </li>
                ))}
            </ul>
  
          </div>
          
          ...
        </div>
      );
    }
  */

  /*
    generateHeaders() {
      return {
  
        headers: new HttpHeaders(
          {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'Bearer ' + Cookie.get('access_token')
          })
      };
    }
  */
}