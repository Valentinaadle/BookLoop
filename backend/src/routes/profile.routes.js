const express = require('express');
const router = express.Router();
const { getAllProfiles, getProfileByUserId, updateProfileByUserId, createProfile } = require('../models/Profile');
const { getUserById } = require('../models/User');

// Ruta de diagnóstico - obtener todos los perfiles
router.get('/', async (req, res) => {
    try {
        const profiles = await getAllProfiles();
        res.json(profiles);
    } catch (error) {
        console.error('Error al obtener perfiles:', error);
        res.status(500).json({ error: 'Error al obtener perfiles' });
    }
});

// Obtener perfil de usuario con información del usuario
router.get('/:userId', async (req, res) => {
    try {
        console.log('Buscando perfil para userId:', req.params.userId);
        
        // Obtener información del usuario
        const user = await getUserById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Intentar obtener el perfil
        let profile;
        try {
            profile = await getProfileByUserId(req.params.userId);
        } catch (error) {
            console.log('Perfil no encontrado, creando uno nuevo...');
            // Si no existe el perfil, crear uno nuevo
            profile = await createProfile({
                userid: parseInt(req.params.userId),
                direccion: null,
                telefono: null,
                ciudad: null,
                pais: null,
                codigopostal: null,
                foto_perfil: null,
                createdat: new Date(),
                updatedat: new Date()
            });
        }

        // Combinar información del usuario con el perfil
        const response = {
            ...profile,
            User: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                username: user.username
            }
        };

        console.log('Perfil encontrado:', response);
        res.json(response);
   
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
});

// Actualizar perfil
router.put('/:userId', async (req, res) => {
    try {
        const { foto_perfil, biografia, telefono, direccion, ciudad, pais, codigopostal } = req.body;
        
        const updates = {
            foto_perfil,
            biografia,
            telefono,
            direccion,
            ciudad,
            pais,
            codigopostal,
            updatedat: new Date()
        };

        // Filtrar valores undefined/null para no sobreescribir con valores vacíos
        Object.keys(updates).forEach(key => {
            if (updates[key] === undefined) {
                delete updates[key];
            }
        });

        const updatedProfile = await updateProfileByUserId(req.params.userId, updates);
        
        // Obtener información del usuario para la respuesta
        const user = await getUserById(req.params.userId);
        const response = {
            ...updatedProfile,
            User: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                username: user.username
            }
        };

        res.json(response);
   
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
});

module.exports = router; 