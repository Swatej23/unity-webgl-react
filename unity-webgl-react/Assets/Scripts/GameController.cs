using System.Runtime.InteropServices;
using TMPro;
using UnityEngine;

public class GameController : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void CallReactMethodFromUnity(int count);
    
    [DllImport("__Internal")]
    private static extern void UpdateCountInReact(int count); // For real-time updates
    
    [SerializeField] private GameObject badge;
    [SerializeField] private TextMeshPro countText;
    
    private int _currentCount;
    
    void Start()
    {
        _currentCount = 0;
        UpdateCountText();
    }
    
    public void OnClickBadge()
    {
        _currentCount++;
        UpdateCountText();
        Debug.Log("Badge clicked! New count: " + _currentCount);
        CheckForAchievement();
    }

    public void OnClickReset()
    {
        _currentCount = 0;
        UpdateCountText();
        Debug.Log("Count reset.");
    }

    private void UpdateCountText()
    {
        if (countText)
        {
            countText.text = _currentCount.ToString();
#if UNITY_WEBGL && !UNITY_EDITOR
    UpdateCountInReact(_currentCount); // <- real-time count update
#endif
        }
        else
        {
            Debug.LogError("CountText is not assigned in the Inspector!");
        }
    }

    private void CheckForAchievement()
    {
        if (_currentCount > 0 && _currentCount % 25 == 0)
        {
            Debug.Log($"Achievement Unlocked: You have clicked {_currentCount} times.");
            
#if UNITY_WEBGL && !UNITY_EDITOR
                CallReactMethodFromUnity(_currentCount);
#endif
        }
    }
}
