import Header from 'components/Header'
import Alerts from 'components/Alert'
import { Container, Row, Col, } from 'react-bootstrap'

function AppLayout(props) {
    const { heading, menus, children } = props
    const wrapChildren = (props.wrapChildren) ? props.wrapChildren : true;

    return (
        <div id="AppLayout" className="layout">
            <Header menus={menus} />
            <Alerts />
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
        </div>
    );
}

export default AppLayout;