import { useContext } from 'react';
import RaceContext from '../store/RaceContext';
import RaceState from '../constants/RaceState';
import RaceConfig from '../components/RaceConfig';
import RaceCountdown from '../components/RaceCountdown';
import ActiveRace from '../components/ActiveRace';
import RaceLanding from '../components/RaceLanding';
import RaceSteps from '../components/RaceSteps';
import RaceSetupBackButton from '../components/RaceSetupBackButton';
import { Layout } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';

const RacePage = () => {
  const { raceState } = useContext(RaceContext);

  return (
    <Layout style={{ height: '100%' }}>
      <Content style={{ height: '100%' }}>
        {(raceState === RaceState.Configuring ||
          raceState === RaceState.Waiting) && <RaceSteps />}
        {raceState === RaceState.Landing && <RaceLanding />}
        {raceState === RaceState.Configuring && <RaceConfig />}
        {raceState === RaceState.Waiting && <RaceCountdown />}
        {raceState === RaceState.Active && <ActiveRace />}
      </Content>
      <Footer>
        {(raceState === RaceState.Configuring ||
          raceState === RaceState.Waiting) && <RaceSetupBackButton />}
      </Footer>
    </Layout>
  );
};

export default RacePage;
