const express = require('express');
const router = express.Router();
const { Profile, User } = require('../models');

// Ruta de diagnóstico - obtener todos los perfiles
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.findAll({
            include: [{
                model: User,
                attributes: ['id', 'nombre', 'apellido', 'email', 'username']
            }]
        });
        res.json(profiles);
    } catch (error) {
        console.error('Error al obtener perfiles:', error);
        res.status(500).json({ error: 'Error al obtener perfiles' });
    }
});

// Obtener perfil de usuario
router.get('/:userId', async (req, res) => {
    try {
        console.log('Buscando perfil para userId:', req.params.userId);
        
        const profile = await Profile.findOne({
            where: { UserId: req.params.userId },
            include: [{
                model: User,
                attributes: ['nombre', 'apellido', 'email', 'username']
            }]
        });

        console.log('Perfil encontrado:', profile);

        if (!profile) {
            console.log('Perfil no encontrado para userId:', req.params.userId);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Enviar el perfil encontrado
        res.json(profile);
   
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
});

// Actualizar perfil
router.put('/:userId', async (req, res) => {
    try {
        const { foto_perfil, biografia, fecha_nacimiento, telefono, direccion } = req.body;
        
        const [updated] = await Profile.update({
            foto_perfil,
            biografia,
            fecha_nacimiento,
            telefono,
            direccion
        }, {
            where: { UserId: req.params.userId }
        });

        if (updated) {
            const updatedProfile = await Profile.findOne({
                where: { UserId: req.params.userId },
                include: [{
                    model: User,
                    attributes: ['nombre', 'apellido', 'email', 'username']
                }]
            });
            res.json(updatedProfile);
        } else {
            res.status(404).json({ error: 'Perfil no encontrado' });
        }
   
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
});

module.exports = router; 