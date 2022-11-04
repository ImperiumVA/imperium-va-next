import Header from 'components/Header'
import { Container, Row, Col, } from 'react-bootstrap'

function HomeLayout(props) {
    const { heading, menus, children } = props
    const wrapChildren = (props.wrapChildren) ? props.wrapChildren : true;

    return (
        <div id="HomeLayout" className="layout mt-4">
            <Container>
                {children}
            </Container>
        </div>
    );
}

export default HomeLayout;