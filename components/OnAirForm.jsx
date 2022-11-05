import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button, FloatingLabel, ButtonGroup, FormControl } from 'react-bootstrap'
import * as Yup from 'yup'
import classNames from 'classnames'
import { CompanyService } from 'services'



const uuid4RegExp = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)

const companySchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Too Short!')
    .max(200, 'Too Long!')
    .required('Company Name is required'),
  identifier: Yup.string()
    .min(3, 'Too Short!')
    .max(4, 'Too Long!')
    .required('Company Identifier is required'),
  companyId: Yup.string()
    .min(36, 'Too Short!')
    .max(36, 'Too Long!')
    .matches(uuid4RegExp, 'Company ID is not correct'),
  apiKey: Yup.string()
    .min(36, 'Too Short!')
    .max(36, 'Too Long!')
    .matches(uuid4RegExp, 'Company API Key is not correct'),
}).required()

export function OnAirForm({ doSubmit, }) {
  const initialState = {
    identifier: '',
    name: '',
    companyId: '',
    apiKey: '',
    isLoading: false,
    hasLoaded: false,
    formIsValid: false,
  }

  const [state, setState] = useState(initialState)

  const {
    identifier,
    name,
    companyId,
    apiKey,
    isLoading,
    hasLoaded,
    formIsValid,
  } = state

  const loadOnAirCompanyDetails = async () => {

    const x = {
      companyId: companyId,
      apiKey: apiKey,
    }

    toggleIsLoadding()
    
    await CompanyService.getOnAirCompanyDetails(x)
    .then((company) => {
        const newCompany = {
            identifier: company.AirlineCode,
            name: company.Name,
            companyId: company.Id,
            lastConnection: company.LastConnection,
            lastReportDate: company.LastReportDate,
            reputation: company.Reputation,
            creationDate: company.CreationDate,
            difficultyLevel: company.DifficultyLevel,
            uTCOffsetinHours: company.UTCOffsetinHours,
            paused: company.Paused,
            pausedDate: company.PausedDate,
            level: company.Level,
            levelXP: company.LevelXP,
            transportEmployeeInstant: company.TransportEmployeeInstant,
            transportPlayerInstant: company.TransportPlayerInstant,
            forceTimeInSimulator: company.ForceTimeInSimulator,
            useSmallAirports: company.UseSmallAirports,
            useOnlyVanillaAirports: company.UseOnlyVanillaAirports,
            enableSkillTree: company.EnableSkillTree,
            checkrideLevel: company.CheckrideLevel,
            enableLandingPenalities: company.EnableLandingPenalities,
            enableEmployeesFlightDutyAndSleep: company.EnableEmployeesFlightDutyAndSleep,
            aircraftRentLevel: company.AircraftRentLevel,
            enableCargosAndChartersLoadingTime: company.EnableCargosAndChartersLoadingTime,
            inSurvival: company.InSurvival,
            payBonusFactor: company.PayBonusFactor,
            enableSimFailures: company.EnableSimFailures,
            disableSeatsConfigCheck: company.DisableSeatsConfigCheck,
            realisticSimProcedures: company.RealisticSimProcedures,
            travelTokens: company.TravelTokens,
            currentBadgeId: company.CurrentBadgeId,
            currentBadgeUrl: company.CurrentBadgeUrl,
            currentBadgeName: company.CurrentBadgeName,
            lastWeeklyManagementsPaymentDate: company.LastWeeklyManagementsPaymentDate,
        }

        console.log('newCompany', newCompany)

        setState({
            ...state,
            hasLoaded: true,
            isLoading: false,
            ...newCompany
        })
    })

  }

  const onSubmit = (e) => {
    e.preventDefault()

    let x = {
      name,
      identifier,
      companyId: (syncOnAir && companyId) ? companyId : undefined,
      apiKey: (syncOnAir && apiKey) ? apiKey : undefined,
    }

    doSubmit(x)
  }

  const toggleIsLoadding = (override) => {
    setState({
      ...state,
      isLoading: override || !isLoading
    })
  }

  const toggleHasLoaded = (override) => {
    setState({
      ...state,
      hasLoaded: override || !hasLoaded
    })
  }

  const handleFieldChange = (e) => {
    const {
      name,
      type,
      value,
      checked,
    } = e.target

    setState({
      ...state,
      [name]: (type === 'checkbox') ? checked : value,
    })
  }

  return (
    <div>
      <Form onSubmit={onSubmit}>
        <Row>
          <Col md={6}>
          <Form.Group>
            <FloatingLabel label='OnAir Company ID'>
              <Form.Control
                type='text'
                name='companyId'
                id='companyId'
                className='mb-3'
                onChange={handleFieldChange}
                value={companyId}
              />  
            </FloatingLabel>
          </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <FloatingLabel label='OnAir Company API Key'>
                <Form.Control
                  type='text'
                  name='apiKey'
                  id='apiKey'
                  className='mb-3'
                  onChange={handleFieldChange}
                  value={apiKey}
                />
                </FloatingLabel>
            </Form.Group>
          </Col>
        </Row>
        {(companyId.length === 36 && apiKey.length === 36) && (<>
        <Row>
          <Col md={4}>
            <Form.Group>
              <FloatingLabel label='Company Identifier (CAO) Code'>
                <Form.Control
                  type='text'
                  name='identifier'
                  id='identifier'
                  className='mb-3'
                  defaultValue={identifier}
                  onChange={handleFieldChange}
                  disabled
                />
              </FloatingLabel>
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Group>
              <FloatingLabel label='Company Name'>
                <Form.Control
                  type='text'
                  name='name'
                  id='name'
                  className='mb-3'
                  defaultValue={name}
                  onChange={handleFieldChange}
                  disabled
                />
              </FloatingLabel>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
              <Button
                variant='primary'
                onClick={loadOnAirCompanyDetails}
                disabled={(isLoading || (!apiKey || !companyId))}
              >
                Load OnAir Company Details
              </Button>
          </Col>
        </Row>
        </>)}
        <Row>
          <Col>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              type='submit'
              variant='success'
              disabled={(!hasLoaded || isLoading || (companyId.length !== 36 || apiKey.length !== 36))}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default OnAirForm