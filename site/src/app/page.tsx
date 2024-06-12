import { promises as fs } from 'fs';

async function Home() {
  const file = await fs.readFile(process.cwd() + '/src/data/window-rankings.json', 'utf8');
  const data = JSON.parse(file);
  const displayData = JSON.stringify(data['All-Time'], null, 2);

  return (
    <main>
      <h1 className='text-3xl'>backyardultra.app</h1>
      <p>An application for backyard ultras</p>
      <pre>
        {displayData}
      </pre>
    </main>
  );
}

export default Home;