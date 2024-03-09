import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';

import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import { Link, NavLink } from 'react-router-dom';
import '../styles.css'
import { LoginContext } from '../context/LoginContext.js';
import { useContext } from 'react';
import { BiLogOut } from "react-icons/bi";


export default function Navigation() {

  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);

  const { isOpen, onToggle } = useDisclosure();

  const handleLogout = () => {
    const isFreeTrialOver = jwtDecode(localStorage.getItem("token"))?.isFreeTrialOver;


    if (!isFreeTrialOver) {
      console.log("Request dalo or true kro")
    }

    localStorage.removeItem("token")
    localStorage.removeItem("isFreeTrialOver")
    localStorage.removeItem("isSubscribed")
    setIsLoggedIn(false)
  }

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>

          <img justify={{ base: 'center', md: 'left' }} src="https://static.vecteezy.com/system/resources/previews/011/125/368/original/cute-calculator-icon-png.png" alt="logo" width={20}/>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>

          {
            !isLoggedIn &&
            <>
              <Button fontSize={'sm'} fontWeight={500} variant={'link'}>
                <Link to='/login'>
                  Login
                </Link>
              </Button>

              <Link to='/signup'>
                <Button
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'blue.400'}
                  _hover={{
                    bg: 'blue.300',
                  }}>
                  Sign Up

                </Button>
              </Link>
            </>
          }

          {
            isLoggedIn &&
            <Link to='/login'>
              <Tooltip label="Logout">
                <Button
                  fontWeight={600}
                  color={'white'}
                  bg={'red.400'}
                  _hover={{
                    bg: 'red.300',
                  }}
                  onClick={handleLogout}
                >
                  <BiLogOut />

                </Button>
              </Tooltip>
            </Link>

          }

        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  return (
    <Stack direction={'row'} spacing={10}>
      {NAV_ITEMS.map((navItem) => {
        return (

          <NavLink to={navItem.href}
            className={({ isActive }) => `${isActive ? "active-link" : null}`}
            key={navItem.label}>
            {navItem.label}
          </NavLink>

        )
      })}
    </Stack>
  );
}


const MobileNav = () => {
  return (
    <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <Link to={navItem.href}>
          <MobileNavItem key={navItem.label} {...navItem} />
        </Link>
      ))}
    </Stack>
  );
}

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as="a"
        href={href ?? '#'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}>
        <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <Box key={child.label} py={2} href={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
}

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Feedback',
    href: '/feedback',
  },
  {
    label: 'Calculator',
    href: '/calculator',
  },
  {
    label: 'Subscribe',
    href: '/subscribe',
  },
];
