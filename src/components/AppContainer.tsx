import classNames from 'classnames';
import { NoFuckingThanks } from 'components/NoFuckingThanks';
import React, { FunctionComponent, memo, ReactNode, ReactNodeArray } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';

interface PropTypes {
  bg?: string;
  heading?: string;
  fluid?: boolean;
  children: ReactNode | ReactNodeArray;
  showNft?: boolean;
  closeNft?: VoidFunction;
}

const ContainerContent: FunctionComponent = ({ children }) => (
  <Row className="justify-content-center">
    <Col md={12} lg={10}>
      {children}
    </Col>
  </Row>
);

const AppContainerComponent: React.FC<PropTypes> = ({ bg, fluid, heading, children, showNft = false, closeNft }) => (
  <div className={classNames('py-4', bg && `bg-${bg}`)}>
    <Container fluid={fluid}>
      <ContainerContent>
        <Card>
          {typeof heading === 'string' && <CardHeader>{heading}</CardHeader>}
          <CardBody>{children}</CardBody>
        </Card>
      </ContainerContent>
    </Container>
    {showNft && (
      <div className="pt-4">
        <Container fluid={fluid}>
          <ContainerContent>
            <NoFuckingThanks handleClose={closeNft} />
          </ContainerContent>
        </Container>
      </div>
    )}
  </div>
);

export const AppContainer = memo(AppContainerComponent);
