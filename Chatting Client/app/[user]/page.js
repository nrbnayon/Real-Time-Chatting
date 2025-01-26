import moment from "moment";

const UserHome = () => {
  const formattedDate = moment().format("dddd, MMMM Do YYYY");

  return (
    <div className='bg-background py-2'>
      <div>
        <p className=' text-gray-500 ml-6'>Today {formattedDate}</p>
      </div>
      <div className='gap-5 mt-5 md:mt-10 px-2 md:px-5 '>
        <div>New section heree</div>
      </div>
    </div>
  );
};

export default UserHome;
