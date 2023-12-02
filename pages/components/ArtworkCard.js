import React from "react";
import useSWR from "swr";
import Error from "next/error";
import { Card, Button } from 'react-bootstrap';
import Link from 'next/link';

export default function ArtworkCard({ objectID }){
  
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`, fetcher);

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const {
    primaryImageSmall,
    title,
    objectDate,
    classification,
    medium,
  } = data;

  const imageUrl = primaryImageSmall || 'https://via.placeholder.com/375x375.png?text=[+Not+Available+]';
  const artworkTitle = title || 'N/A';
  const artworkDate = objectDate || 'N/A';
  const artworkClassification = classification || 'N/A';
  const artworkMedium = medium || 'N/A';
  console.log(objectID);
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img src={imageUrl} alt={artworkTitle} />
      <Card.Body>
        <Card.Title>{artworkTitle}</Card.Title>
        <Card.Text>
          Date: {artworkDate}<br />
          Classification: {artworkClassification}<br />
          Medium: {artworkMedium}
        </Card.Text>
        <Link href={`/artwork/${objectID}`} passHref>
          <Button variant="primary">{objectID}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}


