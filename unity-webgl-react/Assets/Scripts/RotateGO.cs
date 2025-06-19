using UnityEngine;

public class RotateGameObject : MonoBehaviour
{
    public Vector3 rotationSpeed = new Vector3(0, 0, 30); // Degrees per second for X, Y, Z
    public Space relativeTo = Space.Self; // Rotate in local or world space

    void Update()
    {
        // Apply rotation
        transform.Rotate(rotationSpeed * Time.deltaTime, relativeTo);
    }
}
