import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { AlertService, AlertType } from 'services';
import classNames from 'classnames';
import { Alert } from 'react-bootstrap';

Alerts.propTypes = {
    id: PropTypes.string,
    fade: PropTypes.bool
};

Alerts.defaultProps = {
    id: 'default-alert',
    fade: true
};

export default function Alerts({ id, fade }) {
    const router = useRouter();
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // subscribe to new alert notifications
        const subscription = AlertService.onAlert(id)
            .subscribe(alert => {
                // clear alerts when an empty alert is received
                if (!alert.message) {
                    setAlerts(alerts => {
                        // filter out alerts without 'keepAfterRouteChange' flag
                        const filteredAlerts = alerts.filter(x => x.keepAfterRouteChange);

                        // set 'keepAfterRouteChange' flag to false on the rest
                        filteredAlerts.forEach(x => delete x.keepAfterRouteChange);
                        return filteredAlerts;
                    });
                } else {
                    // add alert to array
                    setAlerts(alerts => ([...alerts, alert]));

                    // auto close alert if required
                    if (alert.autoClose) {
                        setTimeout(() => removeAlert(alert), 3000);
                    }
                }
            });


        // clear alerts on location change
        const clearAlerts = () => {
            setTimeout(() => AlertService.clear(id));
        };
        router.events.on('routeChangeStart', clearAlerts);

        // clean up function that runs when the component unmounts
        return () => {
            // unsubscribe to avoid memory leaks
            subscription.unsubscribe();
            router.events.off('routeChangeStart', clearAlerts);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function removeAlert(alert) {
        if (fade) {
            // fade out alert
            const alertWithFade = { ...alert, fade: true };
            setAlerts(alerts => alerts.map(x => x === alert ? alertWithFade : x));

            // remove alert after faded out
            setTimeout(() => {
                setAlerts(alerts => alerts.filter(x => x !== alertWithFade));
            }, 250);
        } else {
            // remove alert
            setAlerts(alerts => alerts.filter(x => x !== alert));
        }
    };

    if (!alerts.length) return null;

    return alerts.map((alert, index) => {
        const alertVariant = classNames({
            'danger': (alert.type === AlertType.Error),
            'success': (alert.type === AlertType.Success),
            'info': (alert.type === AlertType.Info),
            'warning': (alert.type === AlertType.Warning)
        })

        const dismissable = (alert.type === AlertType.Error) ? false : alert.dismissable || true;

        return (
            <Alert key={index} variant={alertVariant} dismissable={dismissable}>
                {(alert.heading)
                    ? (<Alert.Heading>
                        {alert.heading}
                    </Alert.Heading>)
                    : null
                }
                {alert.message}
            </Alert>
        )
    });
}
