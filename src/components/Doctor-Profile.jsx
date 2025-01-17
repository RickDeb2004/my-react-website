import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firbase";
const DoctorProfileWrapper = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #fffdd0, #faf9f6);
`;

const HeroSection = styled.section`
  background-image: url("images/DSC06815.JPG"); /* Replace with your hero image */
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 100px 0;
  width: 100%;
`;

const HeroImage = styled.img`
  max-width: 400px; /* Ensure the image doesn't exceed its container */
  height: 400px; /* Maintain the aspect ratio */
  display: block; /* Remove any extra spacing */
  margin: 0 auto; /* Center the image horizontally */

  @media (max-width: 768px) {
    max-width: 100px;
    height: 50px;
  }
`;
const DoctorCardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 0;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`;

const DoctorCard = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #ECD06F, #fff3e0);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width:768px){
    flex: 0 0 calc(33.333% - 20px)
    margin-bottom: 20px;
  }
`;

const DoctorImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
`;

const Description = styled.p`
  font-weight: bold;
  white-space: pre-line;
`;

const ViewMoreLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
`;

const DoctorProfile = () => {
  const [doctorsData, setDoctorsData] = useState([]);

  useEffect(() => {
    const imagelistref = ref(storage, "doctors-profile/");

    listAll(imagelistref)
      .then((response) => {
        const fetchDoctorsData = response.items.map((item) =>
          getDownloadURL(item).then((url) => ({
            image: url,
            description: getDoctorDescription(item.name),
            id: item.name,
          }))
        );

        Promise.all(fetchDoctorsData)
          .then((doctors) => {
            setDoctorsData(doctors);
          })
          .catch((error) => {
            console.error("Error fetching doctor profiles:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching image URLs:", error);
      });
  }, []);

  const getDoctorDescription = (name) => {
    const regex = /(\d+)?_([^_]+)_([^_]+)_([^_]+)?\.jpg/i;
    const match = name.match(regex);

    if (match && match.length >= 3) {
      const firstName = capitalizeFirstLetter(match[2]);
      const lastName = capitalizeFirstLetter(match[3]);
      const degree = match[4] ? `${match[4]}` : ""; // Display degree only if it exists
      return `${firstName}\n${lastName}\n${degree}`;
    }

    return "Default description";
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <DoctorProfileWrapper>
      <Navbar />
      <HeroSection>
        <HeroImage />
      </HeroSection>

      <DoctorCardsContainer>
        {doctorsData.map((doctor) => (
          <DoctorCard key={doctor.id}>
            <DoctorImage
              src={doctor.image}
              alt={`Dr. ${doctor.id}`}
              loading="lazy"
            />
            <Description>{doctor.description}</Description>
            <ViewMoreLink to={`/doctor-profile/${doctor.id}`}>
              View More
            </ViewMoreLink>
          </DoctorCard>
        ))}
      </DoctorCardsContainer>
      <Footer />
    </DoctorProfileWrapper>
  );
};

export default DoctorProfile;
