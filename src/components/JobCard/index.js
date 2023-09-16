import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import './index.css'

const JobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDetails
  return (
    <li >
      <Link to={`/jobs/${id}`}>
        <div >
          <img
            src={companyLogoUrl}
            alt="company logo"
            
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
          <div >
            <BsFillBriefcaseFill  />
            <p >{employmentType}</p>
          </div>
          <p >{packagePerAnnum}</p>
        </div>
        <hr  />
        <h1 >Description</h1>
        <p >{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobCard
