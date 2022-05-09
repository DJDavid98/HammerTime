import classNames from 'classnames';
import React, { FunctionComponent, memo, ReactNode, ReactNodeArray } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';

interface PropTypes {
  bg?: string;
  heading?: string;
  fluid?: boolean;
  children: ReactNode | ReactNodeArray;
}

const ContainerContent: FunctionComponent = ({ children }) => (
  <Row className="justify-content-center">
    <Col md={12} lg={10}>
      {children}
    </Col>
  </Row>
);

const AppContainerComponent: React.FC<PropTypes> = ({ bg = 'discord', fluid, heading, children }) => (
  <div className={classNames('py-4', bg && `bg-${bg}`)}>
    <Container fluid={fluid}>
      <ContainerContent>
        <Card>
          {typeof heading === 'string' && <CardHeader>{heading}</CardHeader>}
          <CardBody>{children}</CardBody>
        </Card>
      </ContainerContent>
    </Container>
  </div>
);

export const AppContainer = memo(AppContainerComponent);
