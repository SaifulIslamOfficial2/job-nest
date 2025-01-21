import axios from 'axios'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import useAuth from '../hooks/useAuth'

const UpdateJob = () => {
  const [startDate, setStartDate] = useState(new Date())
  const [job , setJob] = useState ({});
  const {id} = useParams();
  const navigate = useNavigate();
  const {user} = useAuth();
  const dedline = startDate

  useEffect(()=>{
    axios(`${import.meta.env.VITE_API_URL}/job/${id}`)
    .then((res)=>{
      setJob(res.data)
      setStartDate(new Date(res.data.deadline))
    })
  },[id])



const {
  jobTitle, 
  email, 
  buyer,
  category, 
  min_price,
  max_price, 
  description,
  deadline, 
  total_bids,
  _id
} = job ||{};


const handleSubmit = async (e) => {
  e.preventDefault();

  const form = e.target;  // Get the form element
  const jobTitle = form.jobTitle.value;
  const email = form.email.value;
  const category = form.category.value;
  const min_price = form.min_price.value;
  const max_price = form.max_price.value;
  const description = form.description.value;
  const deadline = startDate.toISOString();



  // Ensure these variables are defined and have values
  const updateformData = {
    jobTitle, 
    email, 
    buyer:{
      name:user?.name,
      email:user?.email,
      image :user?.photoURL,
    },
    category, 
    min_price,
    max_price, 
    description,
    deadline : dedline,
    total_bids: total_bids,
  };

 
  try {
    // Using await for axios call
      axios.put(
      `${import.meta.env.VITE_API_URL}/job/${_id}`,
      updateformData
    ).then((res)=>{
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          title: "Update Successfull",
          icon: "success",
          draggable: true,
        
        });
        navigate("/my-posted-jobs")
       
      }
    })
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);

    Swal.fire({
      title: "Error adding job",
      text: error.response?.data || error.message,
      icon: "error",
    });
  }
};

 
  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-306px)] my-12'>
      <section className=' p-2 md:p-6 mx-auto bg-white rounded-md shadow-md '>
        <h2 className='text-lg font-semibold text-gray-700 capitalize '>
          Update a Job
        </h2>

        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2'>
            <div>
              <label className='text-gray-700 ' htmlFor='jobTitle'>
                Job Title
              </label>
              <input
                id='jobTitle'
                name='jobTitle'
                type='text'
                defaultValue={jobTitle}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='emailAddress'>
                Email Address
              </label>
              <input
                id='emailAddress'
                type='email'
                name='email'
                defaultValue={email}
                disabled
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700'>Deadline</label>

              <DatePicker
                className='border p-2 rounded-md'
                selected={startDate}
                onChange={date => setStartDate(date)}
              />
            </div>

            <div className='flex flex-col gap-2 '>
              <label className='text-gray-700 ' htmlFor='category'>
                Category
              </label>
             {category &&  <select
                name='category'
                id='category'
                defaultValue={category}
                className='border p-2 rounded-md'
              >
                <option value='Web Development'>Web Development</option>
                <option value='Graphics Design'>Graphics Design</option>
                <option value='Digital Marketing'>Digital Marketing</option>
              </select>}
            </div>
            <div>
              <label className='text-gray-700 ' htmlFor='min_price'>
                Minimum Price
              </label>
              <input
                id='min_price'
                name='min_price'
                type='number'
                defaultValue={min_price}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>

            <div>
              <label className='text-gray-700 ' htmlFor='max_price'>
                Maximum Price
              </label>
              <input
                id='max_price'
                name='max_price'
                type='number'
                defaultValue={max_price}
                className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 mt-4'>
            <label className='text-gray-700 ' htmlFor='description'>
              Description
            </label>
            <textarea
              className='block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md  focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40  focus:outline-none focus:ring'
              name='description'
              id='description'
              defaultValue={description}
              cols='30'
            ></textarea>
          </div>
          <div className='flex justify-end mt-6'>
            <button className='px-8 py-2.5 leading-5 text-white transition-colors duration-300 transhtmlForm bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600'>
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default UpdateJob
