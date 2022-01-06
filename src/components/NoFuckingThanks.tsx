import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from 'modules/NoFuckingThanks.module.scss';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import React, { MouseEventHandler, useCallback, useEffect, useMemo, useState, VFC } from 'react';
import { Alert, Badge, Button } from 'reactstrap';
import { openUrlInNewWindow, useLocale } from 'src/util/common';
import { getNftData, NftStatus, rickRollLinkPool } from 'src/util/nft';
import { setInterval } from 'timers';

export const fuckNftsStorageKey = 'fuck_nfts';

export const NoFuckingThanks: VFC<{ handleClose?: VoidFunction }> = ({ handleClose }) => {
  const [status, setStatus] = useState<NftStatus | null | false>(null);
  const {
    i18n: { language },
  } = useTranslation();
  const locale = useLocale(language);
  const [checkBackTs, setCheckBackTs] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let checkBackInterval: null | ReturnType<typeof setInterval> = null;

    const clearTs = () => {
      if (checkBackInterval !== null) clearInterval(checkBackInterval);
    };

    const updateStatus = () => {
      if (!mounted) return;

      getNftData()
        .then((data: NftStatus) => {
          if (!mounted) return;
          setStatus(data);

          const updateTimestamp = () => {
            if (!mounted) return;

            const now = new Date();
            const nextUpdateMoment = moment(data.nextUpdate);

            const nowTs = now.getTime();
            const nextUpdateTs = nextUpdateMoment.toDate().getTime();
            if (nowTs < nextUpdateTs) {
              setCheckBackTs(nextUpdateMoment.locale(locale).from(new Date()));
              return;
            }

            // If next update time has passed, fetch the data again
            clearTs();
            setCheckBackTs(null);
            setStatus(null);
            updateStatus();
          };
          checkBackInterval = setInterval(updateTimestamp, 5e3);
          updateTimestamp();
        })
        .catch((e) => {
          console.error(e);
          if (!mounted) return;
          setStatus(false);
        });
    };

    updateStatus();

    return () => {
      mounted = false;
      clearTs();
    };
  }, [locale]);

  const priceDelta = useMemo<null | number>(() => {
    if (!status) return null;

    return status.currentPrice / status.previousPrice - 1;
  }, [status]);

  const handleRightClick: MouseEventHandler = useCallback((e) => {
    e.preventDefault();
    // eslint-disable-next-line no-alert
    alert('Right clicking has been disabled on this element to prevent theft via "Save as…"');
  }, []);

  const handleLogin: MouseEventHandler = useCallback((e) => {
    e.preventDefault();

    const redirectUrl = rickRollLinkPool[Math.floor(rickRollLinkPool.length * Math.random())];

    openUrlInNewWindow(redirectUrl);
  }, []);

  const handleAbout: MouseEventHandler = useCallback((e) => {
    e.preventDefault();

    openUrlInNewWindow('https://twitter.com/charlottejee/status/1387722711766650884');
  }, []);

  return (
    <Alert color="secondary" className={`mb-0 text-center ${styles.nftCard}`} onContextMenu={handleRightClick} isOpen toggle={handleClose}>
      <p>
        <strong>Own a piece of history!</strong> Time is a valuable asset, and this specific timestamp could be yours starting at just
      </p>
      <div className="d-flex align-items-start justify-content-center mb-3">
        <strong className="display-6">
          {status !== null ? (
            status ? (
              <>
                <FontAwesomeIcon icon={['fab', 'ethereum']} className="me-2" />
                {`${status.currentPrice.toFixed(3)} ETH`}
              </>
            ) : (
              <span className="text-danger">
                <span className="fa-layers fa-fw me-2">
                  <FontAwesomeIcon icon="server" className="text-muted" />
                  <FontAwesomeIcon icon="fire" className="text-warning" />
                </span>
                Exchange is down
              </span>
            )
          ) : (
            <span className="text-muted">
              <FontAwesomeIcon icon="life-ring" className="me-2" spin />
              Loading price…
            </span>
          )}
        </strong>
        {priceDelta !== null && (
          <Badge color={priceDelta > 0 ? 'success' : 'danger'} className="ms-2">
            <FontAwesomeIcon icon={priceDelta > 0 ? 'caret-up' : 'caret-down'} />
            {Math.abs(priceDelta * 100).toFixed(2)}%
          </Badge>
        )}
      </div>
      <Button color="light" size="sm" disabled={!status} className="m-1" onClick={handleLogin}>
        <FontAwesomeIcon icon={['fab', 'ethereum']} className="me-2" />
        Sign in with Ethereum
      </Button>
      <Button color="link" size="sm" className="m-1" onClick={handleAbout}>
        What's an NFT?
      </Button>
      <p className="mt-2 mb-0">
        <small>The value is adjusted regularly, check back {checkBackTs === null ? 'later' : checkBackTs} to see the updated price.</small>
      </p>
    </Alert>
  );
};
