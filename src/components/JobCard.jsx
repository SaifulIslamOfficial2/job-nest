/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import { format } from "date-fns";

const JobCard = ({ job }) => {

  const { jobTitle, category, min_price, max_price, total_bids, deadline,_id } =
    job;
    console.log(total_bids);
  return (
    <Link
      to={`/job/${_id}`}
      className="w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md hover:scale-[1.05] transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-light text-gray-800 "> 
        deadline: {format(new Date(deadline),"P")}</span>
        <span className="px-3 py-1 text-[8px] text-blue-800 uppercase bg-blue-200 rounded-full ">
          {category}
        </span>
      </div>

      <div>
        <h1 className="mt-2 text-lg font-semibold text-gray-800 ">
          {jobTitle}
        </h1>

        <p className="mt-2 text-sm text-gray-600 ">
          {job.description.substring(0, 18)}...
        </p>
        <p className="mt-2 text-sm font-bold text-gray-600 ">
          {min_price} - {max_price}
        </p>
        <p className="mt-2 text-sm font-bold text-gray-600 ">
          Total Bids: {total_bids}
        </p>
      </div>
    </Link>
  );
};

export default JobCard;
