import Header from '../common/header';
import Footer from '../common/footer';
import React, {useEffect ,useState } from "react";
import { getUser } from '../utils/Common';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/style.css';

const  Dashboard  = () =>  {
    const [pic, setpic] = useState("");
    const user = getUser();
    if (!user){
        window.location.href = "/login";
    }
    
    const profilePicture = () => {
        let image = (user.photo);
        if (image.includes("https://"))
            setpic(image);
        else{
            setpic("http://localhost:4000/profile-pics/"+image);
        }
        


    }



    useEffect(() => profilePicture(),[]);
      return (
        <div>
            <Header />
            
            <div className="container mt-4 mb-4 p-3 d-flex justify-content-center">
                <div className="card p-4">
                    <div className=" image d-flex flex-column justify-content-center align-items-center"> <button className="btn btn-secondary"> <img src={pic} height="100" width="100" alt={user.name} /></button> <span class="name mt-3">{user.name}</span> <span className="idd">@{user.username}</span>
                        <div className="d-flex flex-row justify-content-center align-items-center gap-2"> <span className="idd1">{user.email}</span> <span><i className="fa fa-copy"></i></span> </div>
                        <div className="text mt-3"> <span>{user.bio}</span> </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
      );
    }
  export default Dashboard