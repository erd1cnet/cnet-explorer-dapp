const localTestnets = [
  ...(process.env.NODE_ENV === 'development'
    ? [
        {
          default: false,
          id: 'mainnet-elastic',
          name: 'Elastic',
          adapter: 'elastic',
          proxyUrl: 'https://api.elrond.com',
          elasticUrl: 'https://elastic-aws.elrond.com',
          numInitCharactersForScAddress: 14,
        },
        {
          id: 'testnet-do-amsterdam',
          name: 'DigitalOcean AMS Testnet',
          proxyUrl: 'http://206.189.240.132:8080',
          elasticUrl: 'http://206.189.240.135',
          adapter: 'elastic',
          numInitCharactersForScAddress: 14,
        },
        {
          id: 'testnet-do-london',
          name: 'DigitalOcean LON Testnet',
          proxyUrl: 'http://167.172.58.140:8080',
          elasticUrl: 'http://134.209.27.15',
          numInitCharactersForScAddress: 14,
          adapter: 'elastic',
        },
        {
          id: 'testnet-do-toronto',
          name: 'DigitalOcean TOR Testnet',
          proxyUrl: '***REMOVED***',
          elasticUrl: '***REMOVED***',
          numInitCharactersForScAddress: 14,
          adapter: 'elastic',
        },
        {
          id: 'testnet-azure-eus2',
          name: 'Azure EastUS2 Testnet',
          proxyUrl: '***REMOVED***',
          elasticUrl: '***REMOVED***',
          numInitCharactersForScAddress: 14,
          adapter: 'elastic',
        },
        {
          id: 'testnet-azure-weu',
          name: 'Azure WestEU Testnet',
          proxyUrl: 'http://51.144.228.174:8080',
          elasticUrl: 'http://13.81.247.54',
          numInitCharactersForScAddress: 14,
          adapter: 'elastic',
        },
        {
          id: 'testnet-azure-uks',
          name: 'Azure UK South Testnet',
          proxyUrl: 'http://51.132.25.1:8080',
          elasticUrl: 'http://51.11.131.187',
          numInitCharactersForScAddress: 14,
          adapter: 'elastic',
        },
        {
          id: 'testnet-azure-all-in-one',
          name: 'Azure All-In-One Testnet',
          proxyUrl: 'http://137.116.230.165:8079',
          elasticUrl: 'http://137.116.230.165:9200',
          numInitCharactersForScAddress: 14,
          adapter: 'elastic',
        },
        {
          id: 'testnet-azure-all-in-one-maiar',
          name: 'Maiar API All-In-One Testnet',
          proxyUrl: '***REMOVED***',
          elasticUrl: '***REMOVED***',
          numInitCharactersForScAddress: 14,
          adapter: 'elastic',
        },
      ]
    : []),
];

export default localTestnets;
