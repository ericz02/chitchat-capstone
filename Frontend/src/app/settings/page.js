import Settings from "@/pages/Settings";
//fetch the current users Id by looking at the req.session.user that was saved when tthe user logged in on the login route
async function getId(){
    const Id = await fetch(`http://localhost:4000/auth/getId`);
    return Id;
}
const user = getId();

const page = () => {
  return <Settings userId = {user.id}/>;
};

export default page;
