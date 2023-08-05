
import Settings from "@/pages/Settings";
//fetch the current users Id by looking at the req.session.user that was saved when tthe user logged in on the login route
async function getUser(){
  const testUserId = await fetch(`http://localhost:4000/auth/getId`);
  return testUserId;
}
const User = getUser();

const page = () => {
  return <Settings userId = {typeof User.id}/>;
};

export default page;
