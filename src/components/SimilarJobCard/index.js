import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails

  return (
    <li >
      <div >
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          
        />
        <div >
          <h1 >{title}</h1>
          <div >
            <AiFillStar />
            <p >{rating}</p>
          </div>
        </div>
      </div>
      <h1 >Description</h1>
      <p >{jobDescription}</p>
      <div >
        <div >
          <IoLocationSharp />
          <p >{location}</p>
        </div>
        <div >
          <BsFillBriefcaseFill />
          <p >{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobCard
