import React, { useState, useEffect } from "react";
import { ProfileComponenet, Container } from "../components";
import { useSelector } from "react-redux";

const Profile = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const [getData, setData] = useState("");

  if (authStatus) {
    useEffect(() => {
      if (userData) {
        setData(userData);
      }
    }, [getData]);
  }
  return getData ? (
    <Container>
      <div className="py-8">
        <ProfileComponenet initialData={getData} />
      </div>
    </Container>
  ) : (
    <p> please loggin , again</p>
  );
};

export default Profile;
