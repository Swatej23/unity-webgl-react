using UnityEngine;

public class BadgeInteraction : MonoBehaviour
{
    private GameController _gameController;
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Awake()
    {
        _gameController = FindFirstObjectByType<GameController>().GetComponent<GameController>();
    }

    private void OnMouseDown()
    {
        _gameController.OnClickBadge();
    }
}
