'use client';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Snackbar,
} from '@mui/material';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
} from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Update inventory from Firebase
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = docs.docs.map((doc) => ({
      name: doc.id,
      quantity: doc.data().quantity || 0,
    }));
    setInventory(inventoryList);
  };

  // Helper function to remove items
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const quantity = docSnap.data().quantity || 0;

      if (quantity > 1) {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      } else {
        await deleteDoc(docRef);
      }

      setSnackbarMessage(`${item} removed from inventory`);
      setSnackbarOpen(true);
      await updateInventory();
    }
  };

  // Helper function to add items
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const quantity = docSnap.data().quantity || 0;
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
      setSnackbarMessage(`${item} added to inventory`);
    } else {
      await setDoc(docRef, { quantity: 1 });
      setSnackbarMessage(`${item} created and added to inventory`);
    }
    setSnackbarOpen(true);
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  // Modal helper functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Box>
      <AppBar position="static" sx={{ bgcolor: '#ADD8E6' }}>
        <Toolbar>
          <Typography variant="h6" color="black" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#64b5f6',  // Lighter blue for Add Item button
              '&:hover': {
                bgcolor: '#42a5f5',  // Slightly darker shade on hover
              },
            }}
            onClick={handleOpen}
          >
            Add Item
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ paddingTop: '16px', backgroundColor: '#f4f6f8' }} // Pastel background
      >
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            bgcolor="white"
            borderRadius="8px"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{ transform: 'translate(-50%, -50%)' }}
          >
            <Typography variant="h6">Add Item</Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: '#64b5f6',  // Lighter blue for Add button
                '&:hover': {
                  bgcolor: '#42a5f5',  // Lighter shade on hover
                },
              }}
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Box>
        </Modal>

        <Box
          border="1px solid #ccc"
          borderRadius="8px"
          width="800px"
          bgcolor="#fff"
          boxShadow={3}
          p={3}
        >
          <Typography variant="h4" textAlign="center" color="black" gutterBottom>
            Inventory Items
          </Typography>
          <Stack spacing={2} overflow="auto">
            {inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"  // Pastel gray background
                borderRadius="8px"
                boxShadow={1}
                padding={2}
              >
                <Typography variant="h6" color="black">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h6" color="black">
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#64b5f6',  // Lighter blue for Add button
                      '&:hover': {
                        bgcolor: '#42a5f5',  // Lighter shade on hover
                      },
                    }}
                    onClick={() => addItem(name)}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#e57373',  // Lighter red for Remove button
                      '&:hover': {
                        bgcolor: '#ef5350',  // Slightly darker shade on hover
                      },
                    }}
                    onClick={() => removeItem(name)}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
}


//here is my original version of my code 
/** 
'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button
} from '@mui/material';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query
} from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  // Update inventory from Firebase
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = docs.docs.map(doc => ({
      name: doc.id,
      ...doc.data(),
    }));
    setInventory(inventoryList);
  };

  // Helper function to remove items
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  // Helper function to add items
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  // Modal helper functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Main page
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>

      <Box border="1px solid #333" width="800px">
        <Box
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
      </Box>

      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {inventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#f0f0f0"
            padding={5}
          >
            <Typography variant="h3" color="#333" textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h3" color="#333" textAlign="center">
              {quantity}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => addItem(name)}
              >
                Add
              </Button>
              <Button
                variant="contained"
                onClick={() => removeItem(name)}
              >
                Remove
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>

      
    </Box>
  );
}

//older version
'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button
} from '@mui/material';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query
} from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  // Update inventory from Firebase
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = docs.docs.map(doc => ({
      name: doc.id,
      ...doc.data(),
    }));
    setInventory(inventoryList);
  };

  // Helper function to remove items
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  // Helper function to add items
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  // Modal helper functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Main page
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>

      <Box border="1px solid #333" width="800px">
        <Box
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
      </Box>

      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {inventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width="100%"
            minHeight="150px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#f0f0f0"
            padding={5}
          >
            <Typography variant="h3" color="#333" textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h3" color="#333" textAlign="center">
              {quantity}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={() => addItem(name)}
              >
                Add
              </Button>
              <Button
                variant="contained"
                onClick={() => removeItem(name)}
              >
                Remove
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>

      <Typography variant="h1">Inventory Management</Typography>
    </Box>
  );
}

 **/


