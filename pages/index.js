import HomeHeader from 'components/HomeHeader'
import { useRouter } from 'next/router'
import { MenuRepo } from 'repos'
import Logo from 'components/Logo';
import { Container, Row, Col, } from 'react-bootstrap';


export async function getServerSideProps(ctx) {
  const menus = await MenuRepo.findAll({
    serialize: true,
    include: {
        items: true,
    },
  });

  return {
    props: {
      menus: {
        mainMenu: menus.filter((x) => x.slug === 'main-menu')[0],
        adminMenu: menus.filter((x) => x.slug === 'admin-menu')[0],
      },
    },
  }
}

function Home({ menus, ...props }) {
  const router = useRouter()

  return (
    <div id="HomeLayout" className="layout mt-3">
        <HomeHeader menus={menus} />
        <Container>
            <Row>
                <Col md={{ span: 4, offset: 3 }}>
                    <Logo width={700} height={700} />
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default Home