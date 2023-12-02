import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAtom } from "jotai"
import { searchHistoryAtom } from "@/store"
import { addToHistory } from '@/lib/userData';

export default function AdvancedSearch() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)


  const submitForm = async (data) => {

    let queryString = '';

    queryString += 'searchBy=true';
  
    queryString +=
    data.searchBy === 'title' ? '&title=true' :
    data.searchBy === 'tags' ? '&tags=true' :
    data.searchBy === 'artistOrCulture' ? '&artistOrCulture=true' : '';

    queryString += data.geoLocation ? `&geoLocation=${encodeURIComponent(data.geoLocation)}` : '';
    queryString += data.medium ? `&medium=${encodeURIComponent(data.medium)}` : '';

    queryString += `&isOnView=${data.isOnView}`;
    queryString += `&isHighlight=${data.isHighlight}`;
    queryString += `&q=${encodeURIComponent(data.q)}`;
    
    setSearchHistory(await addToHistory(queryString)) 

    router.push(`/artwork?${queryString}`);
  }; 

  const onFormSubmit = (data) => {
    if (errors.q) {
      return;
    }

    submitForm(data);
  };

  return (
    <Form onSubmit={handleSubmit(onFormSubmit)}>
      <Row>
        <Col>
          <Form.Group className={`mb-3 ${errors.q ? 'is-invalid' : ''}`}>
            <Form.Label>Search Query</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="q"
              {...register('q', { required: true })}
            />
            {errors.q && <div className="invalid-feedback">This field is required.</div>}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Label>Search By</Form.Label>
          <Form.Select name="searchBy" className="mb-3" {...register('searchBy')}>
            <option value="title">Title</option>
            <option value="tags">Tags</option>
            <option value="artistOrCulture">Artist or Culture</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Geo Location</Form.Label>
            <Form.Control type="text" placeholder="" name="geoLocation" {...register('geoLocation')} />
            <Form.Text className="text-muted">
              Case Sensitive String (e.g., &ldquo;Europe,&rdquo;, &ldquo;France,&rdquo;, &ldquo;Paris,&rdquo;, &ldquo;China,&rdquo;, &ldquo;New York,&rdquo;, etc.), with multiple values separated by the | operator            </Form.Text>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Medium</Form.Label>
            <Form.Control type="text" placeholder="" name="medium" {...register('medium')} />
            <Form.Text className="text-muted">
              Case Sensitive String (e.g., &ldquo;Ceramics,&rdquo;, &ldquo;Furniture,&rdquo;, &ldquo;Paintings,&rdquo;, &ldquo;Sculpture,&rdquo;, &ldquo;Textiles,&rdquo;, etc.), with multiple values separated by the | operator
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Check
            type="checkbox"
            label="Highlighted"
            name="isHighlight"
            {...register('isHighlight')}
          />
          <Form.Check
            type="checkbox"
            label="Currently on View"
            name="isOnView"
            {...register('isOnView')}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="success" type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
