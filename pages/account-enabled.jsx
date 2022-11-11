import { HomeLayout } from "layouts";
import { Row, Col, } from 'react-bootstrap'

function AccountEnabled() {
    return (
        <HomeLayout>
            <Row>
                <Col>
                    <h1>Success!</h1>
                    <p>That account has been <strong>enabled.</strong><br />You can close this window</p>
                </Col>
            </Row>
        </HomeLayout>
    );
}

export default AccountEnabled;