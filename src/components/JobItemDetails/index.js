import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarJobCard from '../SimilarJobCard'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetailsApiStatus: apiStatusConstants.initial,
    jobDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getCamelCasedData = data => {
    const jobDetails = data.job_details

    const updatedJobDetails = {
      companyLogoUrl: jobDetails.company_logo_url,
      companyWebsiteUrl: jobDetails.company_website_url,
      employmentType: jobDetails.employment_type,
      jobDescription: jobDetails.job_description,
      location: jobDetails.location,
      rating: jobDetails.rating,
      title: jobDetails.title,
      packagePerAnnum: jobDetails.package_per_annum,
      skills: jobDetails.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      })),
      lifeAtCompnay: {
        description: jobDetails.life_at_company.description,
        imageUrl: jobDetails.life_at_company.image_url,
      },
    }

    const similarJobs = data.similar_jobs.map(eachJob => ({
      companyLogoUrl: eachJob.company_logo_url,
      employmentType: eachJob.employment_type,
      id: eachJob.id,
      jobDescription: eachJob.job_description,
      location: eachJob.location,
      rating: eachJob.rating,
      title: eachJob.title,
    }))

    return {updatedJobDetails, similarJobs}
  }

  getJobItemDetails = async () => {
    this.setState({jobDetailsApiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const {updatedJobDetails, similarJobs} = this.getCamelCasedData(data)

      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs,
        jobDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderApiFailureView = () => (
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
        
        onClick={() => this.getJobItemDetails()}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      rating,
      title,
      packagePerAnnum,
      companyWebsiteUrl,
      skills,
      lifeAtCompnay,
    } = jobDetails

    return (
      <div >
        <div >
          <div >
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              
            />
            <div >
              <h1 >{title}</h1>
              <div >
                <AiFillStar />
                <p >{rating}</p>
              </div>
            </div>
          </div>
          <div >
            <div >
              <IoLocationSharp />
              <p >{location}</p>
            </div>
            <div>
              <BsFillBriefcaseFill  />
              <p >{employmentType}</p>
            </div>
            <p >{packagePerAnnum}</p>
          </div>

          <hr  />
          <div>
            <h1 >Description</h1>
            <a href={companyWebsiteUrl} >
              Visit
              <FiExternalLink  />
            </a>
          </div>
          
          <p >{jobDescription}</p>
          <h1 >Skills</h1>
          <ul >
            {skills.map(eachSkill => {
              const {imageUrl, name} = eachSkill
              return (
                <li  key={name}>
                  <img src={imageUrl} alt={name}  />
                  <p >{name}</p>
                </li>
              )
            })}
          </ul>
          <h1 >Life at Company</h1>
          <div >
            <p >{lifeAtCompnay.description}</p>
            <img
              
              src={lifeAtCompnay.imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1 >Similar Jobs</h1>
        <ul >
          {similarJobs.map(eachJob => (
            <SimilarJobCard key={eachJob.id} jobDetails={eachJob} />
          ))}
        </ul>
      </div>
    )
  }

  renderResponse() {
    const {jobDetailsApiStatus} = this.state
    switch (jobDetailsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderJobDetails()
      case apiStatusConstants.failure:
        return this.renderApiFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div >
        <Header />
        {this.renderResponse()}
      </div>
    )
  }
}

export default JobItemDetails
