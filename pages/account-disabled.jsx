import { HomeLayout } from "layouts";
import { Row, Col, } from 'react-bootstrap'

function AccountDisabled() {
    return (
        <HomeLayout>
            <Row>
                <Col>
                    <h1>Welp</h1>
                    <p><strong>Your account is currently disabled</strong><br/> If You&apos;ve just registered, please give us a bit to activate Your account. Otherwise, reach out to us in Discord.</p>
                </Col>
            </Row>
        </HomeLayout>
    );
}

export default AccountDisabled;