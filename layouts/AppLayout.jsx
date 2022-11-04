import Header from 'components/Header'
import { Container, Row, Col, } from 'react-bootstrap'

function AppLayout(props) {
    const { heading, children } = props
    const wrapChildren = (props.wrapChildren) ? props.wrapChildren : true;

    return (
        <>
            <Header />
            {(heading && typeof heading === 'string')
                ? (
                    <Container>
                        <Row>
                            <Col>
                                <h1>{heading}</h1>
                            </Col>
                        </Row>
                    </Container>)
                : heading
            }
            {(wrapChildren)
                ? (<Container>
                    {children}
                </Container>)
                : children
            }
        </>
    );
}

export default AppLayout;