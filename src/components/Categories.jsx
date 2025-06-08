// eslint-disable-next-line no-unused-vars
import React from "react";
import styled from "styled-components";

const GridContainer = styled.div`
  width: 100%;
  padding: 20px;
  background: #ffffff;
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: 20px;

  /* Hide scrollbar for WebKit-based browsers (Chrome, Safari, Opera) */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;

  /* Hide scrollbar for Internet Explorer and Edge */
  -ms-overflow-style: none;
`;

const Card = styled.div`
  scroll-snap-align: start;
  position: relative;
  min-width: 580px;
  height: 320px;
  background-size: cover;
  background-position: center;
  border-radius: 15px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: #eee;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    min-width: 300px;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const CardContent = styled.div`
  position: absolute;
  padding: 16px;
  z-index: 10;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const CategoryTag = styled.a`
  background: #0c1b33;
  color: white;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 20px;
  align-self: flex-start;
  text-decoration: none;

  &:hover {
    background: #0c1b33;
    color: white;
  }
`;

const NewsTitle = styled.a`
  font-size: 18px;
  font-weight: 600;
  text-decoration: none;
  line-height: 1.3;

  &:hover {
    text-decoration: underline;
  }
`;

const accordionData = [
  {
    image:
      "https://i.pinimg.com/736x/85/ed/76/85ed76c39424fe5d6a210bac1747e734.jpg",
    title: "Debate & Discussions",
    description: "Engage in structured debates and group dialogues.",
  },
  {
    image:
      "https://i.pinimg.com/736x/6e/5e/68/6e5e6802468b94b1bdbe31306d9e0402.jpg",
    title: "Career Talks",
    description: "Learn from alumni, professionals & recruiters.",
  },
  {
    image:
      "https://i.pinimg.com/736x/60/b4/e7/60b4e744da7ab38de99228eba9051ec2.jpg",
    title: "Panel & Open Forums",
    description: "Participate in expert panels & open conversations.",
  },
  {
    image:
      "https://i.pinimg.com/736x/bd/a0/e7/bda0e7a17ffbe41b0e4dddcec7c258b1.jpg",
    title: "Fun & Interactive",
    description: "Quizzes, roleplays, and creative speaking events.",
  },
  {
    image:
      "https://i.pinimg.com/736x/28/c6/fe/28c6fe63865893320996be14eafc3a49.jpg",
    title: "Social & Political Awareness",
    description: "Discussions on current issues & social topics.",
  },
];

const Category = () => {
  return (
    <GridContainer>
      {accordionData.map((item, index) => (
        <Card key={index} style={{ backgroundImage: `url(${item.image})` }}>
          <Overlay />
          <CardContent>
            <CategoryTag href="#">{item.title}</CategoryTag>
            <NewsTitle href="#">{item.description}</NewsTitle>
          </CardContent>
        </Card>
      ))}
    </GridContainer>
  );
};

export default Category;
