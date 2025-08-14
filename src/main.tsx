import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';


import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

createRoot(document.getElementById("root")!).render(
	<AptosWalletAdapterProvider optInWallets={['Petra']} autoConnect={false}>
		<App />
	</AptosWalletAdapterProvider>
);
