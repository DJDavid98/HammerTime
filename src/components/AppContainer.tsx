import classNames from 'classnames';
import React, { memo, ReactNode, ReactNodeArray } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';

interface PropTypes {
  bg?: string;
  heading?: string;
  fluid?: boolean;
  children: ReactNode | ReactNodeArray;
}

const AppContainerComponent: React.FC<PropTypes> = ({ bg, fluid, heading, children }) => (
  <div className={classNames('py-4', bg && `bg-${bg}`)}>
    <Container fluid={fluid}>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card>
            {typeof heading === 'string' && <CardHeader>{heading}</CardHeader>}
            <CardBody>{children}</CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
);

export const AppContainer = memo(AppContainerComponent);
