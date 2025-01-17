// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firbase";

const PicWrapper = styled.div`
  background: linear-gradient(135deg, #fffdd0, #faf9f6);
`;

const HeroSection = styled.section`
  background-image: url("images/DSC06815.JPG"); /* Replace with your hero image path */
  background-size: cover;
  background-position: center;
  color: white;
  text-align: center;
  padding: 100px 0; /* Adjust the padding as needed */

  @media (max-width: 768px) {
    background-size: cover;
  }
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

const PhotoGalleryHeading = styled.h2`
  margin: 25px 0; /* Adjust the margin as needed */
  text-align: center;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px; /* Adjust the gap between cards as needed */
  padding: 25px; /* Adjust the padding as needed */
`;

const Card = styled.div`
  background: linear-gradient(135deg, #ecd06f, #fff3e0);
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const CardImage = styled.img`
  max-width: 100%;
  height: auto;
`;

const Pic = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const imagelistref = ref(storage, "gallery/");

  useEffect(() => {
    listAll(imagelistref)
      .then((response) => {
        const urls = response.items.map((item) => getDownloadURL(item));
        Promise.all(urls)
          .then((urlArray) => {
            setImageUrls(urlArray);
          })
          .catch((error) => {
            console.error("Error fetching image URLs:", error);
          });
      })
      .catch((error) => {
        console.error("Error listing images:", error);
      });
  }, []);

  return (
    <PicWrapper>
      <Navbar />

      <HeroSection>
        <HeroImage />
      </HeroSection>

      <PhotoGalleryHeading>Photo Gallery</PhotoGalleryHeading>

      <CardContainer>
        {imageUrls.map((imageUrl, index) => (
          <Card key={index}>
            <CardImage
              src={imageUrl}
              alt={`Project ${index + 1}`}
              loading="lazy"
            />
          </Card>
        ))}
      </CardContainer>
      <Footer />
    </PicWrapper>
  );
};

export default Pic;
