import React, { useState, useEffect } from "react";
import useSWR from "swr";
import Error from "next/error";
import { Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import { useAtom } from 'jotai';
import { favouritesAtom } from '@/store';
import { addToFavourites, removeFromFavourites } from "@/lib/userData";

export default function ArtworkCardDetail({ objectID }) {
  
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null, fetcher);

  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList]);

  const favouritesClicked = async () => {
    if (showAdded) {
      // Remove objectID from favouritesList
      setFavouritesList(await removeFromFavourites(objectID)) 
    } else {
      // Add objectID to favouritesList
      setFavouritesList(await addToFavourites(objectID)) 
    }

    // Toggle showAdded value
    setShowAdded(!showAdded);
  };

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const {
    primaryImage,
    medium,
    artistDisplayName,
    creditLine,
    dimensions,
    artistWikidata_URL,
  } = data;

  const imageUrl = primaryImage;
  const artworkMedium = medium || 'N/A';
  const artistName = artistDisplayName || 'N/A';
  const credit = creditLine || 'N/A';
  const artworkDimensions = dimensions || 'N/A';

  return (
    <Card>
      {imageUrl && <Card.Img src={imageUrl} alt={artistName} />}
      <Card.Body>
        <Card.Text>
          Medium: {artworkMedium}<br /><br />
          Artist: {artistName}<br />
          Credit Line: {credit}<br />
          Dimensions: {artworkDimensions}<br />
          {artistWikidata_URL && (
            <a href={artistWikidata_URL} target="_blank" rel="noreferrer">wiki</a>
          )}
        </Card.Text>&nbsp;
        <Button
          variant={showAdded ? "primary" : "outline-primary"}
          onClick={favouritesClicked}
        >
          {showAdded ? "+ Favourite(added)" : "+ Favourite"}
        </Button>&nbsp; 
        <Link href={`/artwork/${objectID}`} passHref>
          <Button variant="primary">{objectID}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}
