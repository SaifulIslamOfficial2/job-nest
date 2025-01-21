import axios from "axios";
import { compareAsc, format } from "date-fns";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

const JobDetails = () => {
  const [job, setJob] = useState({});
  const { id } = useParams();
  const [startDate, setStartDate] = useState(new Date());
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [datetim, setDatetime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios(`${import.meta.env.VITE_API_URL}/job/${id}`)
        .then((res) => {
          setJob(res.data);
          setStartDate(res.data.deadline ? new Date(res.data.deadline) : new Date());
        })
        .catch((err) => {
          console.error("Error fetching job data:", err);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Unable to fetch job details. Please try again later.",
          });
        });
    }
  }, [id]);

  const {
    jobTitle,
    email,
    buyer,
    category,
    min_price,
    max_price,
    description,
    deadline,
    _id,
  } = job || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target;
    const price = form.price.value;
    const comment = form.comment.value;
    const deadlineBid = startDate;

    // Price range validation
    if (parseFloat(max_price) < parseFloat(price) || parseFloat(min_price) > parseFloat(price)) {
      setErrorMessage(`Price should be between $${min_price} and $${max_price}`);
      setIsSubmitting(false);
      return;
    }
    setErrorMessage("");

    // Deadline validation
    const jobDeadline = new Date(deadline);
    if (compareAsc(deadlineBid, jobDeadline) === 1) {
      setDatetime("Deadline should be before the job deadline");
      setIsSubmitting(false);
      return;
    }
    setDatetime("");

    // Self-bidding validation
    if (buyer && buyer.email === user?.email) {
      Swal.fire({
        position: "top",
        icon: "error",
        title: "You cannot place a bid on your own job.",
        showConfirmButton: false,
        timer: 1500,
      });
      setIsSubmitting(false);
      return;
    }

    // Submit bid
    const bidData = {
      price,
      comment,
      deadline: deadlineBid,
      email: user?.email,
      jobId: _id,
      buyer: buyer?.email,
      jobTitle,
      category,
      status: "pending",
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/bids`, bidData);
      if (response.data.insertedId) {
        form.reset();
        Swal.fire({
          title: "Bid placed successfully!",
          icon: "success",
        });
        navigate("/my-bids");
      }
    } catch (error) {
      Swal.fire({
        title: "You have already bid on this job",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-around gap-5 items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto">
      <div className="flex-1 px-4 py-7 bg-white rounded-md shadow-md md:min-h-[350px]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-light text-gray-800">
            Deadline: {deadline && format(new Date(deadline), "P")}
          </span>
          <span className="px-4 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full">
            {category}
          </span>
          <div className="rounded-full object-cover overflow-hidden w-14 h-14">
            <img
              referrerPolicy="no-referrer"
              src={buyer?.image || "/default-avatar.png"}
              alt="buyer"
            />
          </div>
        </div>
        <div>
          <h1 className="mt-2 text-3xl font-semibold text-gray-800">{jobTitle}</h1>
          <p className="mt-2 text-lg text-gray-600">{description}...</p>
          <p className="mt-6 text-sm font-bold text-gray-600">Buyer Details</p>
          <p className="mt-2 text-sm text-gray-600">Name: {buyer?.name}</p>
          <p className="mt-2 text-sm text-gray-600">Email: {buyer?.email}</p>
          <p className="mt-6 text-lg font-bold text-gray-600">
            Price Range: ${min_price} - ${max_price}
          </p>
        </div>
      </div>
      <section className="p-6 w-full bg-white rounded-md shadow-md flex-1 md:min-h-[350px]">
        <h2 className="text-lg font-semibold text-gray-700 capitalize">Place a Bid</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-gray-700" htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                name="price"
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md"
              />
              <p className="text-red-700">{errorMessage}</p>
            </div>
            <div>
              <label className="text-gray-700" htmlFor="emailAddress">Email Address</label>
              <input
                id="emailAddress"
                type="email"
                name="email"
                value={user?.email || ""}
                disabled
                required
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-200 rounded-md"
              />
            </div>
            <div>
              <label className="text-gray-700" htmlFor="comment">Comment</label>
              <input
                id="comment"
                name="comment"
                type="text"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-gray-700">Deadline</label>
              <DatePicker
                className="border p-2 rounded-md"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
              <p className="text-red-600">{datetim}</p>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Place Bid"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default JobDetails;
