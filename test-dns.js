import dns from 'dns';

console.log('Testing SRV lookup with Google DNS...');
dns.setServers(['8.8.8.8']);

dns.resolveSrv('_mongodb._tcp.koffee.41jmhpz.mongodb.net', (err, addresses) => {
    if (err) {
        console.error('DNS SRV Lookup Failed:', err.message);
    } else {
        console.log('DNS SRV Lookup Success. Addresses:', addresses);
    }
});
