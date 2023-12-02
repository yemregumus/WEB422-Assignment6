import { useRouter } from "next/router"
import { useAtom } from "jotai"
import { searchHistoryAtom, favouritesAtom} from "@/store"
import Card from "react-bootstrap/Card"
import { ListGroup } from "react-bootstrap"
import { Button } from "react-bootstrap"
import styles from "@/styles/History.module.css"
import { removeFromHistory } from "@/lib/userData"


export default function SearchHistory() {
  const router = useRouter()
  
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom) 
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  if(!favouritesList) return null;

  let parsedHistory = []

  searchHistory.forEach((h) => {
    let params = new URLSearchParams(h)
    let entries = params.entries()
    parsedHistory.push(Object.fromEntries(entries))
  })

  function historyClicked(e, index) {
    router.push(`/artwork?${searchHistory[index]}`)
  }

  async function removeHistoryClicked(e, index) {
    e.stopPropagation()
    setSearchHistory(await removeFromHistory(searchHistory[index])) 
  }

  return (
    <>
      {parsedHistory.length === 0 ? (
        <Card>
          <Card.Body>
            <Card.Text as="div">
              <h4>Nothing Here</h4>
              Try searching for some artwork.{" "}
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <ListGroup>
          {parsedHistory.map((historyItem, index) => (
            <ListGroup.Item
              key={index}
              onClick={(e) => historyClicked(e, index)}
              className={styles.historyListItem}
            >
              {" "}
              {Object.keys(historyItem).map((key) => (
                <>
                  {key}: <strong>{historyItem[key]}</strong>&nbsp;
                </>
              ))}
              <Button
                className="float-end"
                variant="danger"
                size="sm"
                onClick={(e) => removeHistoryClicked(e, index)}
              >
                &times;
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  )
}