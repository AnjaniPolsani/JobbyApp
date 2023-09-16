import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'

import JobCard from '../JobCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]
const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
class Jobs extends Component {
  state = {
    jobsList: [],
    profileList: {},
    jobsListStatus: apiStatusConstants.initial,
    employeeCheckedTypes: [],
    activeSalaryRangeId: '',
    searchInput: '',
    profileListStatus: apiStatusConstants.initial,
    activeCheckboxId: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  updateEmploymentTypesChecked = () => {
    const {activeCheckboxId} = this.state
    console.log(activeCheckboxId)
    const {employeeCheckedTypes} = this.state
    let updatedList = employeeCheckedTypes
    if (employeeCheckedTypes.includes(activeCheckboxId)) {
      updatedList = employeeCheckedTypes.filter(
        eachType => eachType !== activeCheckboxId,
      )
    } else {
      updatedList = [...updatedList, activeCheckboxId]
    }

    this.setState({employeeCheckedTypes: updatedList}, this.getJobs)
  }

  updateActiveCheckboxId = event => {
    this.setState(
      {activeCheckboxId: event.target.value},
      this.updateEmploymentTypesChecked,
    )
  }

  renderCheckBoxes = () => (
    <ul>
      {employmentTypesList.map(eachType => (
        <li  key={eachType.employmentTypeId}>
          <input
            type="checkbox"
            
            id={eachType.employmentTypeId}
            value={eachType.employmentTypeId}
            onChange={this.updateActiveCheckboxId}
          />
          <label htmlFor={eachType.employmentTypeId} >
            {eachType.label}
          </label>
        </li>
      ))}
    </ul>
  )

  updateActiveRadioId = event => {
    this.setState({activeSalaryRangeId: event.target.value}, this.getJobs)
  }

  renderRadioButtons = () => {
    const {activeSalaryRangeId} = this.state

    return (
      <ul>
        {salaryRangesList.map(eachType => {
          const isChecked = eachType.salaryRangeId === activeSalaryRangeId
          return (
            <li  key={eachType.salaryRangeId}>
              <input
                type="radio"
                
                id={eachType.salaryRangeId}
                value={eachType.salaryRangeId}
                onChange={this.updateActiveRadioId}
                checked={isChecked}
              />
              <label htmlFor={eachType.salaryRangeId} >
                {eachType.label}
              </label>
            </li>
          )
        })}
      </ul>
    )
  }

  getProfile = async () => {
    this.setState({profileListStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      const profileDetails = data.profile_details
      const updatedData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profileList: updatedData,
        profileListStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileListStatus: apiStatusConstants.failure})
    }
  }

  getJobs = async () => {
    const {employeeCheckedTypes, activeSalaryRangeId, searchInput} = this.state
    const employeeTypes = employeeCheckedTypes.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeTypes}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    this.setState({jobsListStatus: apiStatusConstants.inProgress})
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: updatedData,
        jobsListStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsListStatus: apiStatusConstants.failure})
    }
  }

  renderProfileView = () => {
    const {profileList} = this.state

    const {name, profileImageUrl, shortBio} = profileList

    return (
      <div >
        <img src={profileImageUrl} alt="profile"  />
        <h1 >{name}</h1>
        <p >{shortBio}</p>
      </div>
    )
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  renderProfileFailure = () => (
    <div >
      <button
        
        type="button"
        onClick={this.getProfile}
      >
        Retry
      </button>
    </div>
  )

  renderSearchView = () => {
    const {searchInput} = this.state
    return (
      <div >
        <input
          type="search"
          
          placeholder="search"
          value={searchInput}
          onChange={this.onChangeSearch}
        />
        <button
          
          type="button"
          data-testid="searchButton"
          onClick={() => this.getJobs()}
        >
          <BsSearch  />
        </button>
      </div>
    )
  }

  renderProfileLoader = () => (
    <div  data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileAPiStatus = () => {
    const {profileListStatus} = this.state
    switch (profileListStatus) {
      case apiStatusConstants.inProgress:
        return this.renderProfileLoader()
      case apiStatusConstants.success:
        return this.renderProfileView()
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      default:
        return null
    }
  }

  renderNoJobsView = () => (
    <div >
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        
      />
      <h1 >No Jobs Found</h1>
      <p >
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJobsLoaderView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsApiFailureView = () => (
    <div >
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        
      />
      <h1 >Oops! Something Went Wrong</h1>
      <p >
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        
        onClick={() => this.getJobs()}
      >
        Retry
      </button>
    </div>
  )

  renderJobsList = () => {
    const {jobsList} = this.state
    return (
      <>
        <ul >
          {jobsList.length > 0
            ? jobsList.map(eachJob => (
                <JobCard key={eachJob.id} jobDetails={eachJob} />
              ))
            : this.renderNoJobsView()}
        </ul>
      </>
    )
  }

  renderJobsAPiStatus = () => {
    const {jobsListStatus} = this.state

    switch (jobsListStatus) {
      case apiStatusConstants.inProgress:
        return this.renderJobsLoaderView()
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderJobsApiFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="maincont">
          <div className="cont1">
            {this.renderProfileAPiStatus()}
            <h1>Types of Employment</h1>
            {this.renderCheckBoxes()}
            <h1>Salary Range</h1>
            {this.renderRadioButtons()}
          </div>
          <div className="cont2">
            {this.renderSearchView()}
            {this.renderJobsAPiStatus()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
