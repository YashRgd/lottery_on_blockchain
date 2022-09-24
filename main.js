
const CONTRACTADDRESS = "0x14c6A77dB2e98A431f378eD123408a615e6d921c";
const ABI = [
	{
		"inputs": [],
		"name": "enter",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pickWinner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "random",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "winner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

let winner;


//Function for users to enter the lottery
async function enterLottery() {
	if (window.ethereum) {
		document.getElementById("winnerId").innerHTML = "To Be Announced";
		let provider = new ethers.providers.Web3Provider(window.ethereum)
		await provider.send("eth_requestAccounts", []);
		let signer = await provider.getSigner();
		// console.log("Account address s:", await signer.getAddress());

		const lotteryContract = new ethers.Contract(CONTRACTADDRESS, ABI, signer);
		const transaction = await lotteryContract.enter({ value: ethers.utils.parseEther("0.1") });
		console.log(transaction.hash);
		alert("Entering the lottery...");

		const result = await transaction.wait();
		console.log(result);
		if (result != "undefined") {
			alert("Congrats, Entered the lottery");
		}
	}
	else {
		console.error("Metamask is not installed in the browser");
	}
}

//function for Admin only to pick winner of lottery
async function pickWinner() {
	if (window.ethereum) {
		let provider = new ethers.providers.Web3Provider(window.ethereum)
		await provider.send("eth_requestAccounts", []);
		let signer = await provider.getSigner();
		// console.log("Account address s:", await signer.getAddress());

		const lotteryContract = new ethers.Contract(CONTRACTADDRESS, ABI, signer);
		try {
			const transaction = await lotteryContract.pickWinner();
			console.log(transaction.hash);
			const result = await transaction.wait();
			console.log(result);
			winnerAddress();
		}
		catch (err) {
			alert("Only Admins can call this function");
			console.log("Error is: ", err);
		}

	}
	else {
		console.error("Metamask is not installed in the browser");
	}
}


//Function to get winner address from smart contract
async function winnerAddress() {
	let provider = new ethers.providers.Web3Provider(window.ethereum)
	await provider.send("eth_requestAccounts", []);
	let signer = await provider.getSigner();

	const lotteryContract = new ethers.Contract(CONTRACTADDRESS, ABI, signer);
	winner = await lotteryContract.winner();
	console.log("Winner of Lottery is: ", winner);
	updateWinner();
}


//function to update winner address on UI
function updateWinner() {
	document.getElementById("winnerId").innerHTML = winner.toString();
}


document.getElementById("enter").onclick = enterLottery;
document.getElementById("pickWinner").onclick = pickWinner;