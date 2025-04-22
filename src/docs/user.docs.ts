/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /v1/user/update-user-details:
 *   put:
 *     summary: Update current user details
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user
 *                 example: "John Doe"
 *               organization:
 *                 type: string
 *                 description: Organization of the user
 *                 example: "Example Corp"
 *               profession:
 *                 type: string
 *                 description: Profession of the user
 *                 example: "Software Engineer"
 *               howDidYouHearAboutUs:
 *                 type: string
 *                 description: How the user heard about us
 *                 example: "Internet"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "user-id"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     organization:
 *                       type: string
 *                       example: "Example Corp"
 *                     profession:
 *                       type: string
 *                       example: "Software Engineer"
 *                     howDidYouHearAboutUs:
 *                       type: string
 *                       example: "Internet"
 *       500:
 *         description: Failed to update user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to update user"
 *                 error:
 *                   type: object
 *                   additionalProperties: true
 */
